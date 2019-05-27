import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Thread } from './thread.model';
import { MessagesService } from '../message/messages.service';
import { Message } from '../message/message.model';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import * as _ from '../util/lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class ThreadsService {

    // thread's is an Observable containing up to date list of threads
    threads: Observable<{ [key: string]: Thread }>;
    // ordered threads contains Chronological list of threads
    orderedThreads: Observable<Thread[]>;

    // `current Thread` contains currently list of thread
    currentThread: Subject<Thread> =
        new BehaviorSubject<Thread>(new Thread());

    // Message for currently selected thread
    currentThreadMessages: Observable<Message[]>;


    constructor(public messagesService: MessagesService) {
        this.threads = messagesService.messages.pipe(
            map(
                (messages: Message[]) => {
                    const threads: { [key: string]: Thread } = {};
                    // Store the message thread in out acc. thread
                    messages.map((message: Message) => {
                        threads[message.thread.id] = threads[message.thread.id] || message.thread;
                        // Cache the most recent message of each Thread
                        const messagesThread: Thread = threads[message.thread.id];
                        if (!messagesThread.lastMessage || messagesThread.lastMessage.sentAt < message.sentAt) {
                            messagesThread.lastMessage = message;
                        }
                    });

                    return threads;
                })
        );

        this.orderedThreads = this.threads.pipe(
            map((threadGroups: { [key: string]: Thread }) => {
                const threads: Thread[] = _.values(threadGroups);
                return _.sortBy(threads, (t: Thread) => t.lastMessage.sentAt).reverse();
            })
        );

        // tslint:disable-next-line: max-line-length
        this.currentThreadMessages = combineLatest(this.currentThread, this.messagesService.markThreadAsRead).pipe(
            map(data => {
                const currentThread: Thread = data[0];
                const messages: Message[] = data[1];
                if (currentThread && messages.length > 0) {
                    return _.chain(messages)
                        .filter((message: Message) => message.thread.id === currentThread.id)
                        .map((message: Message) => {
                            message.isRead = true;
                            return message;
                        }).value();
                } else {
                    return [];
                }
            })
        );

        this.currentThread.subscribe(this.messagesService.markThreadAsRead);
    }

    setCurrentThread(newThread: Thread): void {
        this.currentThread.next(newThread);
    }
}

export const threadsServiceInjectables: Array<any> = [
    ThreadsService
  ];
