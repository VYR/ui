import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineExamsComponent } from './online-exams.component';
import { OnlineExamsRoutingModule } from "./online-exams-routing.module";


@NgModule({
  declarations: [
    OnlineExamsComponent
  ],
  imports: [
    CommonModule,
    OnlineExamsRoutingModule
  ]
})
export class OnlineExamsModule { }
