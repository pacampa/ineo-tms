import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { StateService, User, Task } from './state.service';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
   /**
   * Service for http call to backend
   */

  loginResult$: Subject<boolean> = new Subject<boolean>();


  constructor(private http: HttpClient,
    private stateService: StateService) { }

  /**
   * Save a task in DB and reload tasks
   * @param task - task to save in DB
   */
  addTask(task: Task) {
    let obs = this.http.post(`${environment.dbUrl}tasks`, {
      title: task.title,
      description: task.description,
      status: task.status,
      createdBy: task.createdBy,
      assignedTo: task.assignedTo
    });
    obs.subscribe({
      next: (res) => {
        //update list of tasks;
        this.getTasks();
      },
      error: (error:HttpErrorResponse) => {
        console.log("Error in add task");
      },
      complete: () => null
    });
  }

  /**
   * Delete a task from DB and reload tasks
   * @param task - task to remove from DB
   */
  deleteTask(task: Task) {
    let obs = this.http.delete<any>(`${environment.dbUrl}tasks/${task.id}`);
    obs.subscribe({
      next: (res) => {
        //update list of tasks;
        this.getTasks();
      },
      error: (error:HttpErrorResponse) => {
        console.log("Error in remove task");
      },
      complete: () => null
    });
  }

  /**
   * Save a task in DB and reload tasks
   * @param task - task to update in DB
   */
  updateTask(task: Task) {
    let obs = this.http.put<any>(`${environment.dbUrl}tasks/${task.id}`, {
      title: task.title,
      description: task.description,
      status: task.status,
      createdBy: task.createdBy,
      assignedTo: task.assignedTo
    });
    obs.subscribe({
      next: (res) => {
        //update list of tasks;
        this.getTasks();
      },
      error: (error:HttpErrorResponse) => {
        console.log("Error in update task");
      },
      complete: () => null
    });
  }

  /**
   * Get all users using a behavior subject.
   * @returns users observable
   */
  getUsers() {
    let obs = this.http.get(`${environment.dbUrl}users`);
    obs.subscribe({
      next: (res) => {
        //update list of available users;
        this.stateService.users$.next(res as User[]);
      },
      error: (error:HttpErrorResponse) => {
        console.log("Error in retrieving users");
      },
      complete: () => null
    });
    return obs;
  }

  getTasks() {
    let obs = this.http.get(`${environment.dbUrl}tasks`);
    obs.subscribe({
      next: (res) => {
        //update list of available users;
        this.stateService.tasks$.next(res as Task[]);
      },
      error: (error:HttpErrorResponse) => {
        console.log("Error in retrieving tasks");
      },
      complete: () => null
    });
  }

  login(username:string, password:string) {
    this.getUsers().subscribe((users) => {
      let res: Array<User> = (users as Array<User>).filter((user:User) => user.username == username && user.password == password);
      if (res.length == 1) {
        this.stateService.setLoggedIn(res[0]);
        this.loginResult$.next(true);
      }
      else {
        this.stateService.setLoggedOut();
        this.loginResult$.next(false);
      }
    });
  }

}
