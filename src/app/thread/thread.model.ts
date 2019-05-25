import { uuid } from '../util/util';
import { Message } from '../message/message.model';


export class Thread {
    id: string;
    lastMessage: Message;
    avatarSrc: string;
    name: string;

    constructor(id?: string, name?: string, avatarSrc?: string) {
        this.id = id || uuid();
        this.name = name;
        this.avatarSrc = avatarSrc;
    }
}
