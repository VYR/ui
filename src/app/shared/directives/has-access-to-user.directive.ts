import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { USER_TYPE } from '../enums';
import { UserContext } from '../models';
import { ApplicationContextService } from '../services/application-context.service';

@Directive({
    selector: '[appHasAccessToUser]',
})
export class HasAccessToUserDirective {
    private userType!: USER_TYPE;
    constructor(
        private appContext: ApplicationContextService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
        this.appContext.currentUser.subscribe((res: UserContext) => {
            this.userType = res && res.userType;
        });
    }

    @Input() public set appHasAccessToUser(types: Array<USER_TYPE>) {
        // this means open URL
        const has = !types.includes(this.userType);
        if (has) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
