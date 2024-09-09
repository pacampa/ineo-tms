import { StateService, User } from './../services/state.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userById',
  standalone: true
})
export class UserByIdPipe implements PipeTransform {

  constructor(private stateService: StateService) {

  }

  transform(value: string): User | undefined {
    return this.stateService.users$.value.find(user => user.id == value);
  }

}
