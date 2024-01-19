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
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { OnlineFoodCategoriesComponent } from './components/online-food/online-food-categories/online-food-categories.component';
import { OnlineFoodProductsComponent } from './components/online-food/online-food-products/online-food-products.component';
import { OnlineFoodOrdersComponent } from './components/online-food/online-food-orders/online-food-orders.component';
import { OnlineFoodUsersComponent } from './components/online-food/online-food-users/online-food-users.component';
import { OnlineFoodImagesComponent } from './components/online-food/online-food-images/online-food-images.component';
import { OnlineFoodProfileComponent } from './components/online-food/online-food-profile/online-food-profile.component';
import { OnlineFoodSettingsComponent } from './components/online-food/online-food-settings/online-food-settings.component';
import { OnlineFoodAddFormComponent } from './components/online-food/online-food-add-form/online-food-add-form.component';
import { OnlineFoodEditFormComponent } from './components/online-food/online-food-edit-form/online-food-edit-form.component';
import { OnlineFoodViewDetailsComponent } from './components/online-food/online-food-view-details/online-food-view-details.component';
import { OnlineFoodSubCategoriesComponent } from './components/online-food/online-food-sub-categories/online-food-sub-categories.component';
import { DeleteRequestConfirmComponent } from "./components/online-food/delete-request-confirm/delete-request-confirm.component";
import { OnlineFoodImageSelectionComponent } from './components/online-food/online-food-image-selection/online-food-image-selection.component';
@NgModule({
    declarations: [
        HomeComponent, 
        HeaderComponent, 
        SideMenuComponent, 
        TimeoutPopupComponent,
        DeleteRequestConfirmComponent, 
        OnlineFoodCategoriesComponent,        
        OnlineFoodProductsComponent, 
        OnlineFoodOrdersComponent, 
        OnlineFoodUsersComponent, 
        OnlineFoodImagesComponent, 
        OnlineFoodProfileComponent, 
        OnlineFoodSettingsComponent, 
        OnlineFoodAddFormComponent, 
        OnlineFoodEditFormComponent, 
        OnlineFoodViewDetailsComponent, 
        OnlineFoodSubCategoriesComponent, OnlineFoodImageSelectionComponent
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
        MatTabsModule

    ],
    providers: [HomeSandbox],
})
export class HomeModule {}
