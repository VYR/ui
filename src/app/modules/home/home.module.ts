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
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule} from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OnlineFoodOrdersComponent } from './components/online-food/online-food-orders/online-food-orders.component';
import { OnlineFoodProfileComponent } from './components/online-food/online-food-profile/online-food-profile.component';
import { OnlineFoodEditFormComponent } from './components/online-food/online-food-edit-form/online-food-edit-form.component';
import { OnlineFoodViewDetailsComponent } from './components/online-food/online-food-view-details/online-food-view-details.component';
import { DeleteRequestConfirmComponent } from "./components/online-food/delete-request-confirm/delete-request-confirm.component";
import { LandingComponent } from './components/online-food/landing/landing.component';
import { AddToCartComponent } from './components/online-food/add-to-cart/add-to-cart.component';
import { CartComponent } from './components/online-food/cart/cart.component';
@NgModule({
    declarations: [
        HomeComponent, 
        HeaderComponent, 
        SideMenuComponent, 
        TimeoutPopupComponent,
        DeleteRequestConfirmComponent, 
        OnlineFoodOrdersComponent, 
        OnlineFoodProfileComponent, 
        OnlineFoodEditFormComponent, 
        OnlineFoodViewDetailsComponent, 
        LandingComponent, 
        AddToCartComponent,
        CartComponent
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
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatBadgeModule,
        MatSnackBarModule

    ],
    providers: [HomeSandbox],
})
export class HomeModule {}
