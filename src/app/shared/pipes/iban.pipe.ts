import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Iban',
})
export class Iban implements PipeTransform {
    constructor() {}
    public transform(value: any, args?: any): string {
        return value
            ? value
                  .split(' ')
                  .join('')
                  .replace(/(.{4})/g, '$1 ')
            : '';
    }
}
