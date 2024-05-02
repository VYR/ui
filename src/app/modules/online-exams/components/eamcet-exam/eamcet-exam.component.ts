import { Component } from '@angular/core';
import { OnlineExamsService } from "../../online-exams.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-eamcet-exam',
  templateUrl: './eamcet-exam.component.html',
  styleUrls: ['./eamcet-exam.component.scss']
})
export class EamcetExamComponent {


  constructor(private onlineExamsObj : OnlineExamsService , private routerObj : Router){
    onlineExamsObj.onlineExamData.subscribe(
      (dataTwo:any) => {
        console.log(dataTwo.loginStatus);
        if(!dataTwo.loginStatus){
          routerObj.navigate(['/online-exams']);
        }

      }
    );

  }

  

}
