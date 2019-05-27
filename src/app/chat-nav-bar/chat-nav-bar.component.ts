import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../message/messages.service';
import { ThreadsService } from '../thread/threads.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../message/message.model';
import { Thread } from '../thread/thread.model';
import * as _ from '../util/lodash';

@Component({
  selector: 'chat-nav-bar',
  templateUrl: './chat-nav-bar.component.html',
  styleUrls: ['./chat-nav-bar.component.css']
})
export class ChatNavBarComponent implements OnInit {

  unreadMessgesCount: number;

  constructor(public messagesService: MessagesService,
    public threadsService: ThreadsService) { }

  ngOnInit() {
     combineLatest(this.messagesService.messages, this.threadsService.currentThread)
     .pipe(
       map( data => {
           const messages: Message[] = data[0];
           const currentThread: Thread = data[1];
           return [currentThread, messages];
       })
     ).subscribe(([currentThread, messages]: [Thread, Message[]]) => {
         this.unreadMessgesCount = _.reduce(messages, (sum: number, m: Message) => {
           const messageIsInCurrentThread: boolean = m.thread
           && currentThread && (currentThread.id === m.thread.id);

           if (m && !m.isRead && !messageIsInCurrentThread) {
             sum = sum + 1;
           }
           return sum;
         }, 0);
     });
  }

}
