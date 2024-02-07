import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SgsComponentsModule } from 'src/app/sgs-components/sgs-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeSandbox } from './home.sandbox';
import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { TimeoutPopupComponent } from './components/timeout-popup/timeout-popup.component';
import { SgsReportsComponent } from './components/save-gold-scheme/sgs-reports/sgs-reports.component';
import { SgsUsersComponent } from './components/save-gold-scheme/sgs-users/sgs-users.component';
import { SgsUpdateUserComponent } from './components/save-gold-scheme/sgs-update-user/sgs-update-user.component';
import { SgsSchemesComponent } from './components/save-gold-scheme/sgs-schemes/sgs-schemes.component';
import { SgsProfileComponent } from './components/save-gold-scheme/sgs-profile/sgs-profile.component';
import { DeleteRequestConfirmComponent } from './components/save-gold-scheme/delete-request-confirm/delete-request-confirm.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { SgsRefferalsComponent } from './components/save-gold-scheme/sgs-refferals/sgs-refferals.component';
import { SgsSettingsComponent } from './components/save-gold-scheme/sgs-settings/sgs-settings.component';
import { SgsSchemeDetailsComponent } from './components/save-gold-scheme/sgs-scheme-details/sgs-scheme-details.component';
import { SgsSchemeTypesComponent } from './components/save-gold-scheme/sgs-scheme-types/sgs-scheme-types.component';
import { SgsEditFormsComponent } from './components/save-gold-scheme/sgs-edit-forms/sgs-edit-forms.component';
import { SgsAddFormsComponent } from './components/save-gold-scheme/sgs-add-forms/sgs-add-forms.component';
import { SgsDetailsComponent } from './components/save-gold-scheme/sgs-details/sgs-details.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
@NgModule({
    declarations: [
        HomeComponent, 
        HeaderComponent, 
        SideMenuComponent, 
        TimeoutPopupComponent, 
        SgsReportsComponent, 
        SgsUsersComponent,  
        SgsUpdateUserComponent, 
        SgsSchemesComponent, 
        SgsProfileComponent, 
        DeleteRequestConfirmComponent, 
         SgsRefferalsComponent, 
         SgsSettingsComponent, 
         SgsSchemeDetailsComponent, 
         SgsSchemeTypesComponent, 
         SgsEditFormsComponent, 
         SgsAddFormsComponent, 
         SgsDetailsComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
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

    ],
    providers: [HomeSandbox],
})
export class HomeModule {}
