import { Component, Input } from '@angular/core';
import { SCREEN_MODE } from 'src/app/shared/enums';
import { Entitlement } from '../../models/entitlement';

@Component({
    selector: 'app-entitlement-list',
    templateUrl: './entitlement-list.component.html',
    styleUrls: ['./entitlement-list.component.scss'],
})
export class EntitlementListComponent {
    @Input() entitlement!: Entitlement;
    @Input() fullAccountPrivilege: boolean = false;
    @Input() screenMode: SCREEN_MODE = SCREEN_MODE.CREATE;
    @Input() updateMode: any = {};
    @Input() fromNewRim!: boolean;
    @Input() role!: any;
    SCREEN_MODE = SCREEN_MODE;

    onClickEntitlement(entitlement: Entitlement) {
        if (!entitlement.children.length) {
            if (this.evaluate(entitlement)) return;
            entitlement.entitled = !entitlement.entitled;
            entitlement.someChildrenEntitled = !entitlement.someChildrenEntitled;
        }
        entitlement.parent.current = entitlement;
        this._updateParent(entitlement.parent);
    }

    evaluate(entitlement: Entitlement) {
        if (this.screenMode === SCREEN_MODE.CREATE || this.fromNewRim) return false;
        return (
            (this.updateMode.value === 'UPDATE' ? entitlement.isActive : !entitlement.isActive) &&
            entitlement.children.length === 0
        );
    }

    private _updateParent(parent: Entitlement) {
        if (parent && parent.children) {
            parent.entitled = parent.children.every((x) => x.entitled);
            parent.someChildrenEntitled = parent.children.some((x) => x.entitled || x.someChildrenEntitled);
            this._updateParent(parent.parent);
        }
    }

    selectAllChildren(checked: boolean, entitlement: Entitlement) {
        this._updateChildren(checked, entitlement);
        this._updateParent(entitlement);
    }

    private _updateChildren(checked: boolean, entitlement: Entitlement) {
        entitlement.entitled = checked;
        entitlement.someChildrenEntitled = checked;
        if (entitlement.children.length) {
            entitlement.children.forEach((x: Entitlement) => {
                this._updateChildren(checked, x);
            });
        }
    }

    isAllSelected(entitlement: Entitlement): boolean {
        return entitlement.children.length
            ? entitlement.children.every((child: Entitlement) => child.entitled)
            : entitlement.entitled;
    }

    getProgress(entitlement: Entitlement) {
        if (!entitlement.children.length) return '';
        const active = entitlement.children.filter((x) => x.someChildrenEntitled).length;
        return `${active}/${entitlement.children.length}`;
    }
}
