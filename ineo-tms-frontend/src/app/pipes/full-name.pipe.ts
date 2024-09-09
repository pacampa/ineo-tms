import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@mainapp/services/state.service';

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {

  transform(value: User | undefined): string {
    return `${value?.name} ${value?.surname}`;
  }

}
