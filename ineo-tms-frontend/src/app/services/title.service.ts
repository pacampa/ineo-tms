import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  /**
   * A service that maintain the title of the accessed section
   */

  title:string = "";
  titleChanged$: Subject<string> = new Subject<string>();

  constructor() { }

  setTitle(title:string) {
    this.title = title;
    this.titleChanged$.next(title);
  }

}
