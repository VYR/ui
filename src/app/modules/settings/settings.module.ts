import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { SettingsSandbox } from './settings.sandbox';

@NgModule({
    declarations: [SettingsComponent],
    imports: [CommonModule, FlexLayoutModule, SettingsRoutingModule, CibComponentsModule],
    providers: [SettingsSandbox],
})
export class SettingsModule {}
