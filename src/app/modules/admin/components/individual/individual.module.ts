import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualComponent } from './individual.component';
import {  IndidualRoutingModule } from './individual-routing.module';
import { SgsComponentsModule } from 'src/app/sgs-components/sgs-components.module';
import { FlexLayoutModule } from '@angular/flex-layout'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { DirectivesModule } from 'src/app/shared/directives/directives.module'; 
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs'; 
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';



@NgModule({
  declarations: [
    IndividualComponent,
    
  ],
  imports: [

    CommonModule,
    IndidualRoutingModule,
    SgsComponentsModule,
    FlexLayoutModule,
    MatMenuModule,
    MatRippleModule,
    MatButtonModule,
    DirectivesModule,
    MatSelectModule,
    FormsModule, ReactiveFormsModule,
    MatInputModule,
    PipesModule,
    MatTooltipModule,
    MatTabsModule,
    CKEditorModule
  ]
})
export class IndividualModule { }
