import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomDatePipe } from './date.pipe';
import { CIBDefinition } from './cib-definition.pipe';
import { Iban } from './iban.pipe';
import { SafePipe } from './safe.pipe';
import { NumberToWordsPipe } from './number-to-words.pipe';

@NgModule({
    declarations: [CIBDefinition, Iban, SafePipe, CustomDatePipe, NumberToWordsPipe],
    imports: [CommonModule],
    providers: [CIBDefinition, Iban, SafePipe, CustomDatePipe, NumberToWordsPipe],
    exports: [CIBDefinition, Iban, SafePipe, CustomDatePipe, NumberToWordsPipe],
})
export class PipesModule {
    public static forRoot() {
        return {
            ngModule: PipesModule,
            providers: [],
        };
    }
}
