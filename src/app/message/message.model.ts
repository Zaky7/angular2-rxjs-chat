import { Thread } from '../thread/thread.model';
import { User } from '../user/user.model';
import { uuid } from '../util/util';

export class Message {
    id: string;
    isRead: boolean;
    sentAt: Date;
    text: string;
    author: User;
    thread: Thread;

    constructor(obj ?: any) {
        this.id = obj && obj.id  || uuid();
        this.isRead = obj && obj.isRead || false;
        this.sentAt = obj && obj.sentAt || new Date();
        this.author = obj && obj.author || null;
        this.thread = obj && obj.thread || null;
        this.text   = obj && obj.text || null;
    }
}
