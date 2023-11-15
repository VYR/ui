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

@NgModule({
    declarations: [HomeComponent, HeaderComponent, SideMenuComponent, TimeoutPopupComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        CibComponentsModule,
        FlexLayoutModule,
        MatMenuModule,
        MatRippleModule,
        MatButtonModule,
        DirectivesModule,
    ],
    providers: [HomeSandbox],
})
export class HomeModule {}
