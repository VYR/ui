import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineExamsComponent } from './online-exams.component';
import { OnlineExamsRoutingModule } from "./online-exams-routing.module";
import { EamcetExamComponent } from './components/eamcet-exam/eamcet-exam.component';
import { JntuOnlineExamComponent } from './components/jntu-online-exam/jntu-online-exam.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [
    OnlineExamsComponent,
    EamcetExamComponent,
    JntuOnlineExamComponent
  ],
  imports: [
    CommonModule,
    OnlineExamsRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule
  ]
})
export class OnlineExamsModule { }
