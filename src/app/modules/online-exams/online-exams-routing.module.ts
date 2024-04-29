import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnlineExamsComponent } from './online-exams.component';
import { EamcetExamComponent } from './components/eamcet-exam/eamcet-exam.component';
import { JntuOnlineExamComponent } from './components/jntu-online-exam/jntu-online-exam.component';

const routes: Routes = [
  {
    path : "",
    component : OnlineExamsComponent,
    children : [
      {
        path : "eamcet-exam",
        component : EamcetExamComponent
      },
      {
        path : "jntu-exam",
        component : JntuOnlineExamComponent
      }
    ]
  }
 
  

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OnlineExamsRoutingModule { }
