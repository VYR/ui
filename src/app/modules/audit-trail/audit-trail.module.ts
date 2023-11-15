import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuditTrailRoutingModule } from './audit-trail-routing.module';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AuditTrailComponent } from './audit-trail.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuditTrailSandbox } from './audit-trail.sandbox';

@NgModule({
    declarations: [AuditTrailComponent],

    imports: [
        CommonModule,
        FlexLayoutModule,
        AuditTrailRoutingModule,
        CibComponentsModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatTooltipModule,
        PipesModule,
        MatRadioModule,
        DirectivesModule,
        MatCardModule,
    ],
    providers: [AuditTrailSandbox],
})
export class AuditTrailModule {}
