import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '@mainapp/services/api-client.service';
import { StateService, Task, TaskStatus } from '@mainapp/services/state.service';
import { TitleService } from '@mainapp/services/title.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
    NzFlexModule,
    NzStatisticModule,
    NzGridModule,
    DecimalPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
    aspectRatio: 1,
    scales: {
      y: {
        ticks: {
          callback: function(value: number) {
            return Number.isInteger(value) ? value : null;
          },
          stepSize: 1,
        },
      },
    },
  };

  public barChartLabels = ['To do', 'In progress', 'Done'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    { data: [65, 59, 80], label: 'Tasks' }
  ];

  todoLength: number = 0;
  inProgressLength: number = 0;
  doneLength: number = 0;
  nUsers: number = 0;
  valueColor: string = "#CF1322";


  constructor(
    private apiClientService: ApiClientService,
    public stateService: StateService,
    private titleService: TitleService) {
  }


  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');

    /**
     * From fetched tasks, assignments to sublists for each state
     * for every sublist, a counter of tasks is available
     */
    this.stateService.tasks$.subscribe((data) => {
      this.todoLength = data.filter(data => data.status == TaskStatus.ToDo).length;
      this.inProgressLength = data.filter(data => data.status == TaskStatus.InProgress).length;
      this.doneLength = data.filter(data => data.status == TaskStatus.Done).length;

      //get number of users
      this.nUsers = this.stateService.users$.value.length;

      //set a color for done statistic
      if (this.doneLength == 0) {
        this.valueColor = "#CF1322";
      }
      else if (this.doneLength < this.todoLength + this.inProgressLength + this.doneLength) {
        this.valueColor = "#FFA500";
      }
      else {
        this.valueColor = "#3F8600";
      }

      let newData = [
        this.todoLength,
        this.inProgressLength,
        this.doneLength
      ]
      this.barChartData = [
        { data: newData, label: 'Tasks' }
      ];
    })

    this.apiClientService.getTasks();
  }

}
