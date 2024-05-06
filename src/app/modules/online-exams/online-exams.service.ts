import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OnlineExamsService {

  behaviorSubjectObj = new BehaviorSubject({}); 

  onlineExamData = this.behaviorSubjectObj.asObservable();


  constructor(private httpClientObj : HttpClient) {

   }

  observeSubjectData(dataOne : any){
      this.behaviorSubjectObj.next(dataOne);

  }

  calling(){
     this.httpClientObj.get("http://localhost:4200/assets/api-data/login.json").subscribe(
      (dataThree : any) => {
        console.log(dataThree);

      }
     );
  }

}
