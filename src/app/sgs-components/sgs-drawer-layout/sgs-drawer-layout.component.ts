import { Component, ComponentFactoryResolver, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContainerRefDirective } from 'src/app/shared/directives/container-ref.directive';

@Component({
    selector: 'app-sgs-drawer-layout',
    templateUrl: './sgs-drawer-layout.component.html',
    styleUrls: ['./sgs-drawer-layout.component.scss'],
})
export class SgsDrawerLayoutComponent {
    @ViewChild(ContainerRefDirective) public body!: ContainerRefDirective;
    constructor(
        public dialogRef: MatDialogRef<SgsDrawerLayoutComponent>,
        private componentFactoryResolver: ComponentFactoryResolver,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    public ngAfterViewInit() {
        Promise.resolve(null).then(() => {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.data.component);
            const viewContainerRef = this.body.viewContainerRef;
            viewContainerRef.clear();
            const componentRef = viewContainerRef.createComponent<any>(componentFactory);
            componentRef.instance.data = this.data.data;
        });
    }
}
