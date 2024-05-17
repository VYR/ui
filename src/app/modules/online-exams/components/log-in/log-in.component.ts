import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { OnlineExamsService } from "../../online-exams.service";


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {

  loginGroup = new FormGroup({

    email : new FormControl('', [Validators.required, Validators.email, Validators.maxLength(30)]),

    passwordOne : new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)])

  });

  gmail = "abc@342";

  password = "acv@123";

  // email = new FormControl('', [Validators.required, Validators.email]);

  // passwordOne = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]);


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
    // if (this.email.hasError('required')) {
    //   return 'You must enter a value';
    // }

    // return this.email.hasError('email') ? 'Not a valid email' : '';
    return null;
  }




  login(){
    let dataOne =  this.loginGroup.value;
    console.log(dataOne);
    // console.log(this.email.value);
    // console.log(this.passwordOne.value);
    console.log(this.gmail);
    console.log(this.password);
    this.onlineExamsServiceObj.calling();
    this.onlineExamsServiceObj.observeSubjectData({loginStatus: true});
    this.routerObj.navigate(['/online-exams/eamcet-exam']);
  }

}
