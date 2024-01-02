import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SgsDatePickerComponent } from './sgs-date-picker.component';
import { CUSTOM_DATE_FORMATS } from 'src/app/shared/enums/custom-date-format';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        PipesModule,
    ],
    providers: [{ provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }],
})
export class SgsDatePickerModule {}
