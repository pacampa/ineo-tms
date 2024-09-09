import { ApiClientService } from '@mainapp/services/api-client.service';
import { CommonModule } from '@angular/common';
import { StateService, Task, TaskStatus, User } from './../services/state.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { InitialsPipe } from '@mainapp/pipes/initials.pipe';
import { FullNamePipe } from '@mainapp/pipes/full-name.pipe';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BehaviorSubject, Observable, Subscription, filter, map } from 'rxjs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';



import { UserByIdPipe } from '@mainapp/pipes/user-by-id.pipe';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TitleService } from '@mainapp/services/title.service';


export interface TaskUser {
  id:string,
  name:string,
  surname:string,
  selected:boolean
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    NzAvatarModule,
    NzToolTipModule,
    NzGridModule,
    NzEmptyModule,
    NzButtonModule,
    NzCardModule,
    NzFlexModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzSelectModule,
    NzRadioModule,
    NzIconModule,
    NzPopconfirmModule,
    NzSkeletonModule,
    NzCheckboxModule,
    DragDropModule,
    InitialsPipe,
    FullNamePipe,
    UserByIdPipe
  ],
  providers: [UserByIdPipe, InitialsPipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.sass'
})
export class TasksComponent implements OnInit, OnDestroy {
  taskUsers$: any;

  /**
   * list of tasks on which will be applyed filters
   */
  filteredTasks$ = new BehaviorSubject<Task[]>([]);
  duplicateSubscription: Subscription = new Subscription();

  /**
   * observables to generate and counting sublists
   */
  toDoTasks$: Observable<Task[]> = new Observable();
  inProgressTasks$: Observable<Task[]> = new Observable();
  doneTasks$: Observable<Task[]> = new Observable();

  toDoTasksLength$: Observable<number> = new Observable();
  inProgressTasksLength$: Observable<number> = new Observable();
  doneTasksLength$: Observable<number> = new Observable();

  //filters for fetching tasks
  userFilter: string[] = [];
  titleFilter: string | null = null;
  //

  //sort properites
  sortByTitle: boolean = false;
  sortByUser: boolean = false;
  //

  taskFormVisible:boolean = false;
  taskFormShownForAdd:boolean = true;
  taskForm: FormGroup;
  selectedTask: Task | null = null;

  //variable used to show skeleton on task lists
  taskInLoading:boolean = true;

  constructor(
    private fb: FormBuilder,
    private apiClientService: ApiClientService,
    public stateService: StateService,
    private titleService: TitleService,
    private initialsPipe: InitialsPipe,
    private userByIdPipe: UserByIdPipe) {
    this.taskForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      status: [0, [Validators.required]],
      assignedTo: [null, [Validators.required]]
    });
  }


  addNewTask() {
    this.taskForm.reset();
    this.taskForm.controls["status"].setValue(0);
    this.taskFormShownForAdd = true;
    this.taskFormVisible = true;
  }

  applyFilters(task:Task) {
    //check for a task if is in user filter or match with the search field
    return (this.userFilter.length > 0 && this.userFilter.includes(task.assignedTo) || this.userFilter.length == 0) &&
      (this.titleFilter && task.title.includes(this.titleFilter) || this.titleFilter == null)
  }

  cancelDeleteTask() {
    console.log("nothing to do");
  }

  checkTitleFilter($event: any) {
    if (this.titleFilter == "")
      this.titleFilter = null;
    //force to reload sublists
    this.filteredTasks$.next(this.filteredTasks$.value);
  }

  deleteTask(task: Task) {
    this.apiClientService.deleteTask(task);
  }

  /**
   * Prepare the form to edit selected task
   */
  editTask(task: Task) {
    this.selectedTask = task;
    this.taskForm.controls["title"].setValue(task.title);
    this.taskForm.controls["description"].setValue(task.description);
    this.taskForm.controls["status"].setValue(task.status);
    this.taskForm.controls["assignedTo"].setValue(task.assignedTo);
    this.taskFormShownForAdd = false;
    this.taskFormVisible = true;
  }

  /**
   * Method to mark all controls in order to show errors
   */
  private markAllAsTouched(): void {
    Object.keys(this.taskForm.controls).forEach(field => {
      const control = this.taskForm.get(field);
      if (control) {
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    });
  }

  ngOnDestroy(): void {
    this.duplicateSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.titleService.setTitle("Tasks");
    this.duplicateSubscription = this.stateService.tasks$.subscribe((res) => {
      this.filteredTasks$ =  this.stateService.tasks$;
    })

    /**
     * From fetched tasks, assignments to sublists for each state
     * for every sublist, a counter of tasks is available
     */
    this.toDoTasks$ = this.filteredTasks$.pipe(
      map(tasks => tasks.filter(task => task.status == TaskStatus.ToDo && this.applyFilters(task)))
    );
    this.toDoTasksLength$ = this.toDoTasks$.pipe(
      map(numbers => numbers.length)
    );

    this.inProgressTasks$ = this.filteredTasks$.pipe(
      map(tasks => tasks.filter(task => task.status == TaskStatus.InProgress && this.applyFilters(task)))
    );
    this.inProgressTasksLength$ = this.inProgressTasks$.pipe(
      map(numbers => numbers.length)
    );

    this.doneTasks$ = this.filteredTasks$.pipe(
      map(tasks => tasks.filter(task => task.status == TaskStatus.Done && this.applyFilters(task)))
    );
    this.doneTasksLength$ = this.doneTasks$.pipe(
      map(numbers => numbers.length)
    );

    //fetch all stored tasks with delay in order to show skeleton
    setTimeout(() => {
      this.apiClientService.getTasks();
      this.taskInLoading = false;
    }, 3000);
  }

  /**
   * Change task status by drag .n drop
   * @param $event - drag 'n drop event object
   * @param status - destination task status
   */
  onDropTask($event: CdkDragDrop<any,any,any>, status: TaskStatus) {
    if ($event.previousContainer !== $event.container) {
      let task = $event.item.data as Task;
      this.apiClientService.updateTask({
        id: task.id,
        title: task.title,
        description: task.description,
        status: status,
        createdBy: task.createdBy,
        assignedTo: task.assignedTo
      });
    }
  }

  /**
   * Sort tasks
   * @param field - 0: sort by task title; 1: sort by user name
   */
  sortTasks(field: number) {
    if (field == 0) {
      this.filteredTasks$.next(this.filteredTasks$.value.sort((a, b) => {
        return this.sortByTitle ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)}
      ));
    }
    else if (field == 1) {
      //sort using initials of users
      this.filteredTasks$.next(this.filteredTasks$.value.sort((a, b) => {
        let userA:string | undefined = this.initialsPipe.transform(this.userByIdPipe.transform(a.assignedTo));
        let userB:string | undefined = this.initialsPipe.transform(this.userByIdPipe.transform(b.assignedTo));
        if (userA && userB) {
          return this.sortByUser ? userA.localeCompare(userB) : userB.localeCompare(userA)
        }
        return 0
      }));
    }
  }

  taskFormHandleCancel() {
    this.taskForm.reset();
    this.taskFormVisible = false;
  }

  /**
   * submit the task and call api if form is valid
   * elsewhere show error tips on form
   */
  taskFormHandleOk() {
    this.markAllAsTouched();
    if (this.taskForm.valid) {
      this.taskFormVisible = false;
      if (this.stateService.currentUser) {
        if (this.taskFormShownForAdd) {
          this.apiClientService.addTask({
            id: "-1",
            title: this.taskForm.controls["title"].value,
            description: this.taskForm.controls["description"].value,
            status: 0,
            createdBy: this.stateService.currentUser.id,
            assignedTo: this.taskForm.controls["assignedTo"].value
          });
        }
        else if (this.selectedTask) {
          this.apiClientService.updateTask({
            id: this.selectedTask.id,
            title: this.taskForm.controls["title"].value,
            description: this.taskForm.controls["description"].value,
            status: this.taskForm.controls["status"].value,
            createdBy: this.stateService.currentUser.id,
            assignedTo: this.taskForm.controls["assignedTo"].value
          });
        }
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  toggleUserToFilter(user: User) {
    if (this.userFilter.includes(user.id)) {
      this.userFilter = this.userFilter.filter((fil:string) => fil != user.id);
    }
    else {
      this.userFilter.push(user.id);
    }
    //force to reload sublists
    this.filteredTasks$.next(this.filteredTasks$.value);
  }
}
