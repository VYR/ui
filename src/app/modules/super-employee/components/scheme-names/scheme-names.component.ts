import { Component } from '@angular/core'; 

@Component({
  selector: 'app-scheme-names',
  templateUrl: './scheme-names.component.html',
  styleUrls: ['./scheme-names.component.scss']
})
export class SchemeNamesComponent   {
  public menu: Array<any> = [
    {
       
        name: 'Individual Schemes',
        path: 'individual',
    },
    {
         
        name: 'Group Schemes',
        path: 'group',
    },
    ];
}