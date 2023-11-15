import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoAccessRoutingModule } from './no-access-routing.module';
import { NoAccessComponent } from './no-access.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [NoAccessComponent],
    imports: [CommonModule, NoAccessRoutingModule, CibComponentsModule, MatButtonModule],
})
export class NoAccessModule {}
