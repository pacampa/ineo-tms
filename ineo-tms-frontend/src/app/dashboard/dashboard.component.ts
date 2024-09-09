import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '@mainapp/services/api-client.service';
import { StateService, Task, TaskStatus } from '@mainapp/services/state.service';
import { TitleService } from '@mainapp/services/title.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['To do', 'In progress', 'Done'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    { data: [65, 59, 80], label: 'Tasks' }
  ];


    /**
   * observables to generate and counting sublists
   * FIXME these are the same defined in tasks component, better to place in a service
   */
    toDoTasks$: Observable<Task[]> = new Observable();
    inProgressTasks$: Observable<Task[]> = new Observable();
    doneTasks$: Observable<Task[]> = new Observable();

    toDoTasksLength$: Observable<number> = new Observable();
    inProgressTasksLength$: Observable<number> = new Observable();
    doneTasksLength$: Observable<number> = new Observable();

  constructor(
    private apiClientService: ApiClientService,
    public stateService: StateService,
    private titleService: TitleService) {
  }


  ngOnInit(): void {
    this.titleService.setTitle("Dashboard");

    /**
     * From fetched tasks, assignments to sublists for each state
     * for every sublist, a counter of tasks is available
     */
    this.stateService.tasks$.subscribe((data) => {
      console.log(data);
      let newData = [
        data.filter(data => data.status == TaskStatus.ToDo).length,
        data.filter(data => data.status == TaskStatus.InProgress).length,
        data.filter(data => data.status == TaskStatus.Done).length,
      ]
      this.barChartData = [
        { data: newData, label: 'Tasks' }
      ];
    })


    this.apiClientService.getTasks();
  }

  // Metodo per aggiornare i dati
  updateChartData(newData: number[]): void {

    // Aggiorna i dati della prima serie
    // this.barChartData = [
    //   { data: newData, label: 'Series A' },
    //   { data: [28, 48, 40, 19, 86], label: 'Series B' } // Altri dati non cambiati
    // ];
  }

}
