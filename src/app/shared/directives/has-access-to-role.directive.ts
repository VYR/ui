import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserContext } from '../models';
import { ApplicationContextService } from '../services/application-context.service';

@Directive({
    selector: '[appHasAccessToRole]',
})
export class HasAccessToRoleDirective {
    private role!: string;
    constructor(
        private appContext: ApplicationContextService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
        this.appContext.currentUser.subscribe((res: UserContext) => {
            this.role = ((res && res.role && res.role.name) || '').toUpperCase();
        });
    }

    @Input() public set appHasAccessToRole(roles: Array<string>) {
        // this means open URL
        const indx = roles.includes(this.role);
        // if (roles.includes(this.role)) {
        //     this.viewContainer.createEmbeddedView(this.templateRef);
        // } else {
        //     this.viewContainer.clear();
        // }
        this.viewContainer.createEmbeddedView(this.templateRef);
    }
}
