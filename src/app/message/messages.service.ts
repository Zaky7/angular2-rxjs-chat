import { Message } from './message.model';
import { Subject, Observable } from 'rxjs';
import { Thread } from '../thread/thread.model';
import { User } from '../user/user.model';
import { filter, scan, publishReplay, refCount, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

const initialMessage: Message[] = [];

interface IMessageOperation extends Function {
    // tslint:disable-next-line: callable-types
    (message: Message[]): Message[];
}

@Injectable()
export class MessagesService {
    // a stream that publishes new message only once
    newMessages: Subject<Message> = new Subject<Message>();

    // `message` is stream that emits an array of the most up to date messages
    messages: Observable<Message[]>;

    // updates receives operation to be applied on all our messages
    updates: Subject<any> = new Subject<any>();

    // actions streams
    create: Subject<Message> = new Subject<Message>();
    markThreadAsRead: Subject<any> = new Subject<any>();


    constructor() {
        this.messages = this.updates.pipe(
            // watch the updates and accumulate operation on the messages
            scan((messages: Message[], operation: IMessageOperation) => {
                return operation(messages);
            }, initialMessage),
            // make sure we can share the most recent list of messages across anyone who is interested in subscribing
            publishReplay(1),
            refCount()
        );

        // Create take a message and then puts the operation
        // on update stream to add Message to list of the messages.

        this.create.pipe(
            map(function(message: Message): IMessageOperation {
                return (messages: Message[]) => {
                    return messages.concat(message);
                };
            })
        ).subscribe(this.updates);

        // It takes a Thread and puts an operation on the updates stream to
        // hrMark the Messages as read
        this.markThreadAsRead.pipe(
            map((thread: Thread) => {
                return (messages: Message[]) => {
                    return messages.map((message: Message) => {
                        // Directly copying the messages here, you don't want to do it
                        // try to preserve the immutability
                        if (message.thread.id === thread.id) {
                            message.isRead = true;
                        }
                        return message;
                    });
                };
            })
        ).subscribe(this.updates);
    }

    addMessage(message: Message): void {
        this.newMessages.next(message);
    }

    messagesForThreadUser(thread: Thread, user: User): Observable<Message> {
        return this.newMessages.pipe(filter((message: Message) => {
            return (message.thread.id === thread.id) && (message.author.id !== user.id);
        }));
    }
}
