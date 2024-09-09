import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ApiClientService } from '@mainapp/services/api-client.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { CommonModule } from '@angular/common';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TitleService } from '@mainapp/services/title.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzAlertModule,
    NzFlexModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent implements OnInit, OnDestroy {

  validateForm: FormGroup;
  loginResultSubscription: Subscription = new Subscription();

  loginHasFailed: boolean = false;


  constructor(
      private fb: FormBuilder,
      private apiClientService: ApiClientService,
      private router: Router,
      private titleService: TitleService,
      private notification: NzNotificationService) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  ngOnDestroy(): void {
    this.loginResultSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.titleService.setTitle("Login");
    this.loginResultSubscription = this.apiClientService.loginResult$.subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(['/dashboard']);
      }
      else {
        this.loginHasFailed = true;
      }
    });
  }

  doLogin() {
    this.loginHasFailed = false;
    this.apiClientService.login(this.validateForm.controls["userName"].value, this.validateForm.controls["password"].value);
  }

  showLoginTip() {
    this.notification.blank(
      'Demo version',
      'Available users are <b>dybala</b>, <b>raspadori</b>, <b>zaccagni</b>, <b>baudo</b>.<br/> For all, password is <b>12345678</b> ',
      { nzPlacement: 'top' }
    );
  }

}
