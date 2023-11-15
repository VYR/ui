import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appAlphaNumeric]',
})
export class AlphaNumericDirective {
    constructor() {}

    @HostListener('keypress', ['$event']) public onKeyPress(event: any) {
        return this.validateField(event);
    }

    @HostListener('paste', ['$event']) public onPaste(event: any) {
        return this.validateField(event);
    }

    validateField(event: any) {
        let charCode = event.which ? event.which : event.keyCode;
        return (
            (charCode > 96 && charCode < 123) || (charCode > 64 && charCode < 91) || (charCode > 47 && charCode < 58)
        );
    }
}
