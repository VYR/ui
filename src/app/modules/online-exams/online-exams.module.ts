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
import {MatListModule} from '@angular/material/list';
import { LogInComponent } from './components/log-in/log-in.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    OnlineExamsComponent,
    EamcetExamComponent,
    JntuOnlineExamComponent,
    LogInComponent
  ],
  imports: [
    CommonModule,
    OnlineExamsRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class OnlineExamsModule { }
