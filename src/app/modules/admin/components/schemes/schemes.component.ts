import { Component} from '@angular/core';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})
export class SchemesComponent {
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


