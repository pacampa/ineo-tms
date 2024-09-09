import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export enum TaskStatus {
  ToDo = 0,
  InProgress = 1,
  Done = 2
}

export interface User {
  id:string,
  username:string,
  name:string,
  surname:string,
  password:string,
  color:string
}

export interface Task {
  id:string,
  title:string,
  description:string,
  status:TaskStatus,
  createdBy:string,
  assignedTo:string
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

   /**
    * current logged user; if null, the app is logged out
    */
  currentUser: User | null = null;

  userChanged$: Subject<User | null> = new Subject<User | null>();

   /**
    * list of available users
    */
  users$ = new BehaviorSubject<User[]>([]);

   /**
    * list of available tasks
    */
   tasks$ = new BehaviorSubject<Task[]>([]);

  constructor() { }

  setLoggedIn(user: User) {
    this.currentUser = user;
    this.userChanged$.next(user);
  }

  setLoggedOut() {
    this.currentUser = null;
    this.userChanged$.next(null);
  }

}
