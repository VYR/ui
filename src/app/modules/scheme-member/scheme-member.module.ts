import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SchemeMemberRoutingModule } from './scheme-member-routing.module';
import { SgsComponentsModule } from 'src/app/sgs-components/sgs-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SchemeMemberSandbox   } from './scheme-member.sandbox'; 
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
import {MatToolbarModule} from '@angular/material/toolbar';
import { SchemeDetailsComponent } from './components/scheme-details/scheme-details.component';
import { IndividualComponent } from './components/individual/individual.component';
import { GroupComponent } from './components/group/group.component';
import { SchemeMemberComponent } from './scheme-member.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HeaderComponent } from './components/header/header.component';



@NgModule({
  declarations: [
    SchemeMemberComponent,
    SchemeDetailsComponent,
    IndividualComponent,
    GroupComponent,
    SideMenuComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    SchemeMemberRoutingModule,
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
  providers:[SchemeMemberSandbox]
})
export class SchemeMemberModule { }
