import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoAccessRoutingModule } from './no-access-routing.module';
import { NoAccessComponent } from './no-access.component';
import { SgsComponentsModule } from 'src/app/sgs-components/sgs-components.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [NoAccessComponent],
    imports: [CommonModule, NoAccessRoutingModule, SgsComponentsModule, MatButtonModule],
})
export class NoAccessModule {}
