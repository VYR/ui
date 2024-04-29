import { Component } from '@angular/core';
import { Router } from "@angular/router";
@Component({
  selector: 'app-online-exams',
  templateUrl: './online-exams.component.html',
  styleUrls: ['./online-exams.component.scss']
})
export class OnlineExamsComponent {
  constructor(private routerObj : Router){
    
  }
  user(param1 : any){
      this.routerObj.navigate([param1]);
  }
  
}
