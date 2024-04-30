import { Component } from '@angular/core';
import { Router } from "@angular/router";
@Component({
  selector: 'app-online-exams',
  templateUrl: './online-exams.component.html',
  styleUrls: ['./online-exams.component.scss']
})
export class OnlineExamsComponent {

  folders: any[] = [
    {
      name: 'EAMCET Exam',
      path:  '/online-exams/eamcet-exam',
    },
    {
      name: 'JNTU Exam',
      path : '/online-exams/jntu-exam',
    }
  ];


  isShowMenuBar = false;

  constructor(private routerObj : Router){
    
  }

  user(param1 : any){
      this.routerObj.navigate([param1]);
      this.isShowMenuBar=false;
  }
  
  menuClic(){
    this.isShowMenuBar=true;
  }
  closeButton(){
    this.isShowMenuBar=false;
  }
}
