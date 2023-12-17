import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
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
import { SgsDealersComponent } from './components/save-gold-scheme/sgs-dealers/sgs-dealers.component';
import { SgsCreateUserComponent } from './components/save-gold-scheme/sgs-create-user/sgs-create-user.component';
import { SgsUpdateUserComponent } from './components/save-gold-scheme/sgs-update-user/sgs-update-user.component';
import { SgsSchemesComponent } from './components/save-gold-scheme/sgs-schemes/sgs-schemes.component';
import { SgsProfileComponent } from './components/save-gold-scheme/sgs-profile/sgs-profile.component';
import { DeleteRequestConfirmComponent } from './components/save-gold-scheme/delete-request-confirm/delete-request-confirm.component';
import { SgsUserDetailsComponent } from './components/save-gold-scheme/sgs-user-details/sgs-user-details.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { SgsSchemeIndividualComponent } from './components/save-gold-scheme/sgs-scheme-individual/sgs-scheme-individual.component';
import { SgsSchemeGroupComponent } from './components/save-gold-scheme/sgs-scheme-group/sgs-scheme-group.component';
import { SgsRefferalsComponent } from './components/save-gold-scheme/sgs-refferals/sgs-refferals.component';
import { SgsSettingsComponent } from './components/save-gold-scheme/sgs-settings/sgs-settings.component';
import { SgsSchemeDetailsComponent } from './components/save-gold-scheme/sgs-scheme-details/sgs-scheme-details.component';
@NgModule({
    declarations: [HomeComponent, HeaderComponent, SideMenuComponent, TimeoutPopupComponent, 
        SgsReportsComponent, SgsUsersComponent, SgsDealersComponent, SgsCreateUserComponent,
        SgsUpdateUserComponent, SgsSchemesComponent, SgsProfileComponent, DeleteRequestConfirmComponent, 
        SgsUserDetailsComponent, SgsSchemeIndividualComponent, SgsSchemeGroupComponent, SgsRefferalsComponent, SgsSettingsComponent, SgsSchemeDetailsComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        CibComponentsModule,
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
        MatTabsModule

    ],
    providers: [HomeSandbox],
})
export class HomeModule {}
