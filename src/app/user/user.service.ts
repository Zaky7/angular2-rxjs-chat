import { BehaviorSubject, Subject } from 'rxjs';
import { User } from './user.model';

export class UserService {

    // BehaviourSubject Store the Last Value
    currentUser: Subject<User> = new BehaviorSubject<User>(null);

    public setCurrentUser(newUser: User): void {
        this.currentUser.next(newUser);
    }
}


export const userServiceInjectables: Array<any> = [
    UserService
];
