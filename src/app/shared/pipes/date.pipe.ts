import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'customDate',
})
export class CustomDatePipe extends DatePipe implements PipeTransform {
    override transform(value: any, format?: any): any {
        return super.transform(value, format?format:'dd-MM-YYYY');
    }
}
