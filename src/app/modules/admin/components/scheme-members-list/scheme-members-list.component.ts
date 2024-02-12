import { Component } from '@angular/core'; 


@Component({
  selector: 'app-scheme-members-list',
  templateUrl: './scheme-members-list.component.html',
  styleUrls: ['./scheme-members-list.component.scss']
})
export class SchemeMembersListComponent   {
    public menu: Array<any> = [
      {         
        name: 'Total Scheme Members',
        path: 'total-members',
      },
      {         
        name: 'Individual Scheme Members',
        path: 'individual',
      },
      {           
          name: 'Group Scheme Members',
          path: 'group',
      },
      ];
  }