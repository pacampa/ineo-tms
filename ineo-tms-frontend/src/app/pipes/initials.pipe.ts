import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@mainapp/services/state.service';

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {

  transform(value: User | undefined): string {
    return `${value?.name[0].toUpperCase()}${value?.surname[0].toUpperCase()}`;
  }

}
