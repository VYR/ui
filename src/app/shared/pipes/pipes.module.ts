import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomDatePipe } from './date.pipe';
import { SGSDefinition } from './sgs-definition.pipe';
import { Iban } from './iban.pipe';
import { SafePipe } from './safe.pipe';
import { NumberToWordsPipe } from './number-to-words.pipe';

@NgModule({
    declarations: [SGSDefinition, Iban, SafePipe, CustomDatePipe, NumberToWordsPipe],
    imports: [CommonModule],
    providers: [SGSDefinition, Iban, SafePipe, CustomDatePipe, NumberToWordsPipe],
    exports: [SGSDefinition, Iban, SafePipe, CustomDatePipe, NumberToWordsPipe],
})
export class PipesModule {
    public static forRoot() {
        return {
            ngModule: PipesModule,
            providers: [],
        };
    }
}
