import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SgsComponentsModule } from 'src/app/sgs-components/sgs-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminSandbox } from './admin.sandbox'; 
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
import { AdminComponent } from './admin.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { SuperEmployeesListComponent } from './components/super-employees-list/super-employees-list.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { PromotersListComponent } from './components/promoters-list/promoters-list.component';
import { SchemeMembersListComponent } from './components/scheme-members-list/scheme-members-list.component';
import { SgsDetailsComponent } from './sgs-details/sgs-details.component';
import { SgsUpdateUserComponent } from './sgs-update-user/sgs-update-user.component';
import { DeleteRequestConfirmComponent } from './delete-request-confirm/delete-request-confirm.component';
import { SgsAddFormsComponent } from './components/sgs-add-forms/sgs-add-forms.component';
import { SgsEditFormsComponent } from './components/sgs-edit-forms/sgs-edit-forms.component';


@NgModule({
  declarations: [
    AdminComponent,
    SideMenuComponent,
    HeaderComponent,
    SuperEmployeesListComponent,
    EmployeeListComponent,
    PromotersListComponent,
    SchemeMembersListComponent,
    SgsDetailsComponent,
    SgsUpdateUserComponent,
    DeleteRequestConfirmComponent,
    SgsAddFormsComponent,
    SgsEditFormsComponent


  ],
  imports: [ CommonModule,
    AdminRoutingModule,
    SgsComponentsModule,
    FlexLayoutModule,
    MatMenuModule,
    MatRippleModule,
    MatButtonModule,
    DirectivesModule,
    MatSelectModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    PipesModule,
    MatTooltipModule,
    MatTabsModule,
    CKEditorModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule

    
  ],
  providers: [AdminSandbox],
})
export class AdminModule { }
