import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import {  SchemeMembersListRoutingModule } from './scheme-members-list-routing.module';
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
import { SgsEditFormsComponent } from './components/sgs-edit-forms/sgs-edit-forms.component';
import { SgsSchemeDetailsComponent } from './components/sgs-scheme-details/sgs-scheme-details.component';
import { DeleteRequestConfirmComponent } from './components/delete-request-confirm/delete-request-confirm.component';
import { GroupComponent } from './components/group/group.component';
import { SchemeMembersListComponent } from './scheme-members-list.component';
import { SgsAddFormsComponent } from './components/sgs-add-forms/sgs-add-forms.component';
import { IndividualComponent } from './components/individual/individual.component';




@NgModule({
  declarations: [ 
    SchemeMembersListComponent,
    SgsAddFormsComponent,
    SgsEditFormsComponent,
    SgsSchemeDetailsComponent,
    DeleteRequestConfirmComponent,
    IndividualComponent,
    GroupComponent,
  ],
  imports: [

    CommonModule,
    SchemeMembersListRoutingModule,
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
export class SchemeMembersListModule { }
