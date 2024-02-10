import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SuperEmployeeRoutingModule } from './super-employee-routing.module';
import { SgsComponentsModule } from 'src/app/sgs-components/sgs-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {  SuperEmployeeSandbox   } from './super-empolyee.sandbox'; 
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
import {  SuperEmployeeComponent } from './super-employee.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { PromotersListComponent } from './components/promoters-list/promoters-list.component';
import { SgsDetailsComponent } from './components/sgs-details/sgs-details.component';
import { SgsUpdateUserComponent } from './components/sgs-update-user/sgs-update-user.component';
import { DeleteRequestConfirmComponent } from './components/delete-request-confirm/delete-request-confirm.component';
import { SgsAddFormsComponent } from './components/sgs-add-forms/sgs-add-forms.component';
import { SgsEditFormsComponent } from './components/sgs-edit-forms/sgs-edit-forms.component';
import { SgsSchemeDetailsComponent } from './components/sgs-scheme-details/sgs-scheme-details.component';
import {MatToolbarModule} from '@angular/material/toolbar';


@NgModule({
  declarations: [
    SuperEmployeeComponent,
    SideMenuComponent,
    HeaderComponent,
    EmployeeListComponent,
    PromotersListComponent,
    SgsDetailsComponent,
    SgsUpdateUserComponent,
    DeleteRequestConfirmComponent,
    SgsAddFormsComponent,
    SgsEditFormsComponent,
    SgsSchemeDetailsComponent,
     ],
  imports: [
    CommonModule,
    SuperEmployeeRoutingModule,
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
    CKEditorModule,
    MatToolbarModule
  ],
  providers: [SuperEmployeeSandbox],
})
export class SuperEmployeeModule { }
