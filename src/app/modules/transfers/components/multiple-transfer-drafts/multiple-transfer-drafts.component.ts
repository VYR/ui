import { Component, OnInit } from '@angular/core';
import { TransferSandbox } from '../../transfers.sandbox';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { DeleteDraftDialogComponent } from '../delete-draft-dialog/delete-draft-dialog.component';
import { DECISION } from 'src/app/shared/enums';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';

@Component({
    selector: 'app-multiple-transfer-drafts',
    templateUrl: './multiple-transfer-drafts.component.html',
    styleUrls: ['./multiple-transfer-drafts.component.scss'],
})
export class MultipleTransferDraftsComponent implements OnInit {
    public draftList: any = [];
    DECISION = DECISION;
    constructor(public sandBox: TransferSandbox, private dialog: CibDialogService, private router: Router) {}

    ngOnInit(): void {
        this.getDraftsList();
    }

    private getDraftsList() {
        this.sandBox.getDraftsList('multiple').subscribe((res: any) => {
            if (res.data) {
                this.draftList = res.data;
            }
        });
    }

    public initiateTransfer(data: any, uid: number) {
        const draftData = { data: data, uid: uid };
        this.sandBox.setDraftTransfer(draftData);
        this.router.navigate([APP_ROUTES.SINGLE_MULTIPLE_TRANSFERS]);
    }

    public _deleteDraft(uid: any) {
        const ref = this.dialog.openDialog(CibDialogType.small, DeleteDraftDialogComponent, this.draftList);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision === DECISION.CONFIRM) {
                this.sandBox.deleteDraftsRequest(uid).subscribe((res) => {
                    const index = this.draftList.findIndex((x: any) => x.uid === uid);
                    if (index !== -1) {
                        this.draftList.splice(index, 1);
                    }
                });
            }
        });
    }
}
