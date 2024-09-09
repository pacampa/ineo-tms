import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  title:string = "";
  titleChanged$: Subject<string> = new Subject<string>();

  constructor() { }

  setTitle(title:string) {
    this.title = title;
    this.titleChanged$.next(title);
  }

}
