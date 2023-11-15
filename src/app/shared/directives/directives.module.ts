import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropDirective } from './drag-drop.directive';
import { HasEntitlementAccessToDirective } from './has-entitlement-access-to.directive';
import { HasAccessToRoleDirective } from './has-access-to-role.directive';
import { TextHighlightDirective } from './text-highlight.directive';
import { ContainerRefDirective } from './container-ref.directive';
import { HasAccessToUserDirective } from './has-access-to-user.directive';
import { DropzoneDirective } from './dropzone.directive';
import { DisableControlDirective } from './disable-control.directive';
import { AlphaNumericDirective } from './alpha-numeric.directive';

@NgModule({
    declarations: [
        HasEntitlementAccessToDirective,
        DragDropDirective,
        HasAccessToRoleDirective,
        TextHighlightDirective,
        ContainerRefDirective,
        HasAccessToUserDirective,
        DropzoneDirective,
        DisableControlDirective,
        AlphaNumericDirective,
    ],
    exports: [
        HasEntitlementAccessToDirective,
        DragDropDirective,
        AlphaNumericDirective,
        HasAccessToRoleDirective,
        TextHighlightDirective,
        ContainerRefDirective,
        HasAccessToUserDirective,
        DropzoneDirective,
        DisableControlDirective,
        CommonModule,
    ],
    imports: [CommonModule],
})
export class DirectivesModule {
    public static forRoot() {
        return {
            ngModule: DirectivesModule,
            providers: [],
        };
    }
}
