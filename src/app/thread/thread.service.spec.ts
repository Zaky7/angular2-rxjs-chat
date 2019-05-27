import { User } from '../user/user.model';
import { Thread } from './thread.model';
import { Message } from '../message/message.model';
import { MessagesService } from '../message/messages.service';
import { ThreadsService } from './threads.service';

import * as _ from '../util/lodash';

describe('ThreadService', () => {
    const zakir: User = new User('Nate Murray', '');
    const felipe: User = new User('Felipe Curry', '');

    const t1: Thread = new Thread('t1', 'Thread 1', '');
    const t2: Thread = new Thread('t2', 'Thread 2', '');

    const m1: Message = new Message({
        author: zakir,
        text: 'Hi!',
        thread: t1
    });

    const m2: Message = new Message({
        author: felipe,
        text: 'Hi! Zakir',
        thread: t2
    });

    const messagesService: MessagesService = new MessagesService();
    const threadsService: ThreadsService = new ThreadsService(messagesService);

    threadsService.threads.subscribe(
        (threadIdx: { [key: string]: Thread }) => {
            const threads: Thread[] = _.values(threadIdx);
            const threadNames: string = _.map(threads, (t: Thread) => t.name).join(', ');

            console.log(`=> threads (${threads.length}): ${threadNames}`);
        });

    messagesService.addMessage(m1);
    messagesService.addMessage(m2);
});
