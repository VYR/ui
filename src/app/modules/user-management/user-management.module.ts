import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { SearchUserComponent } from './components/search-user/search-user.component';
import { UsermanagementSandbox } from './user-management.sandbox';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BasicInformationComponent } from './components/basic-information/basic-information.component';
import { AssignEntitlementsComponent } from './components/assign-entitlements/assign-entitlements.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRippleModule } from '@angular/material/core';
import { EntitlementListComponent } from './components/entitlement-list/entitlement-list.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { AccountSelectionComponent } from './components/account-selection/account-selection.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DeleteUserConfirmComponent } from './components/delete-user-confirm/delete-user-confirm.component';

@NgModule({
    declarations: [
        UserManagementComponent,
        CreateUserComponent,
        SearchUserComponent,
        BasicInformationComponent,
        AssignEntitlementsComponent,
        EntitlementListComponent,
        UpdateUserComponent,
        AccountSelectionComponent,
        DeleteUserConfirmComponent,
    ],
    imports: [
        CommonModule,
        UserManagementRoutingModule,
        CibComponentsModule,
        MatStepperModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatRippleModule,
        DirectivesModule,
        FlexLayoutModule,
    ],
})
export class UserManagementModule {}
