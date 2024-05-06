import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { OnlineExamsService } from "../../online-exams.service";


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {

  email = new FormControl('', [Validators.required, Validators.email]);


  constructor(private routerObj : Router, private onlineExamsServiceObj : OnlineExamsService){
    
    onlineExamsServiceObj.onlineExamData.subscribe(
      (param : any) =>{
        console.log(param);
        if(param){
          
          console.log(true);
        }
        else{
          console.log(false);
        }
      }
    );

  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }




  login(){
    this.onlineExamsServiceObj.calling();
    this.onlineExamsServiceObj.observeSubjectData({loginStatus: true});
    this.routerObj.navigate(['/online-exams/eamcet-exam']);
  }

}
