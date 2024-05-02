import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class OnlineExamsService {

  behaviorSubjectObj = new BehaviorSubject({});

  onlineExamData = this.behaviorSubjectObj.asObservable();


  constructor() { }

  observeSubjectData(dataOne : any){
      this.behaviorSubjectObj.next(dataOne);
  }
}
