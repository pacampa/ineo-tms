import { TitleService } from './services/title.service';
import { StateService, User } from './services/state.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiClientService } from './services/api-client.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { FullNamePipe } from './pipes/full-name.pipe';
import { Subscription, filter } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    RouterLink,
    RouterLinkActive,
    NzMenuModule,
    NzToolTipModule,
    NzIconModule,
    NzAvatarModule,
    FullNamePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit, OnDestroy {

  sectionTitle:string;

  /**
   * define if side menu is collapsed
   */
  menuCollapsed: boolean = false;

  /**
   * current logged user; if null, the app is logged out
   */
  currentUser: User | null = null;
  userChangedSubscription: Subscription = new Subscription();
  titleSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private titleService: TitleService,
    private stateService: StateService) {
      this.sectionTitle = "Welcome";
  }
  ngOnDestroy(): void {
    this.userChangedSubscription.unsubscribe();
    this.titleSubscription.unsubscribe();
  }

  doLogout() {
    this.stateService.setLoggedOut();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.apiClient.login("baudo", "12345678");
    this.userChangedSubscription = this.stateService.userChanged$.subscribe((user) => {
      this.currentUser = user;
    })
    this.titleSubscription = this.titleService.titleChanged$.subscribe((title) => {
      //this.sectionTitle = title;
      setTimeout(() => {
        this.sectionTitle = title;
      });
    })
  }

  toggleMenuCollapsed($event: any) {
    this.menuCollapsed = $event;
  }

}
