import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { NotEntitledComponent } from 'src/app/sgs-components/not-entitled/not-entitled.component';
import { UserContext } from '../models';
import { ApplicationContextService } from '../services/application-context.service';

@Directive({
    selector: '[appHasEntitlementAccessTo]',
})
export class HasEntitlementAccessToDirective {
    public entitlements: Array<string> = [];
    @Input() else!: TemplateRef<any>;
    private _elseTemplate!: boolean;
    private _show: boolean = false;
    constructor(
        private appContext: ApplicationContextService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
        this.appContext.currentUser.subscribe((res: UserContext) => {
            this.entitlements = (res && res.entitlement && res.entitlement) || [];
        });
    }

    @Input() public set appHasEntitlementAccessTo(uuid: string) {
        this._show = uuid ? uuid.split(',').some((x: string) => this.entitlements.includes(x)) : true;
    }

    @Input()
    set appHasEntitlementAccessToShowBanner(data: any) {
        this._elseTemplate = true;
    }

    ngOnInit() {
        if (this._show) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
            if (this._elseTemplate) {
                this.viewContainer.createComponent(NotEntitledComponent);
            }
        }
    }
}
