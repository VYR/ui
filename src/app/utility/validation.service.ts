import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
@Injectable()
export class ValidationService {
    /**
     * Validates email address
     *
     * @param formControl - string value
     */
    public validateEmail(formControl: UntypedFormControl): { validateEmail: { valid: boolean } } | null {
        const EMAIL_REGEXP =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_REGEXP.test(formControl.value) ? null : { validateEmail: { valid: false } };
    }

    /**
     * Validates required numeric values
     *
     * @param formControl - string value
     */
    public numericRequired(formControl: UntypedFormControl): { numericRequired: { valid: boolean } } | null {
        return formControl.value && formControl.value > 0 ? null : { numericRequired: { valid: false } };
    }

    /**
     * Validates matching string values
     *
     * @param controlKey - string
     * @param matchingControlKey - string
     */
    public matchingPasswords(controlKey: string, matchingControlKey: string): { [error: string]: any } {
        return (group: UntypedFormGroup): { [key: string]: any } | undefined => {
            if (group.controls[controlKey].value !== group.controls[matchingControlKey].value) {
                return { mismatch: { valid: false } };
            }
            return;
        };
    }
}
