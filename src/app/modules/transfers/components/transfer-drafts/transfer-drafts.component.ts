import { Component, OnInit } from '@angular/core';
import { TransferSandbox } from '../../transfers.sandbox';
import * as moment from 'moment';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { DeleteDraftDialogComponent } from '../delete-draft-dialog/delete-draft-dialog.component';
import { DECISION } from 'src/app/shared/enums';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { Router } from '@angular/router';

@Component({
    selector: 'app-transfer-drafts',
    templateUrl: './transfer-drafts.component.html',
    styleUrls: ['./transfer-drafts.component.scss'],
})
export class TransferDraftsComponent implements OnInit {
    public draftList: any = [];
    activeIndex: number = 0;
    currentDate = moment(new Date()).format('DD-MMM-YYYY');
    DECISION = DECISION;
    constructor(public sandBox: TransferSandbox, private router: Router, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.getDraftsList();
    }

    private getDraftsList() {
        this.sandBox.getDraftsList('single').subscribe((res: any) => {
            if (res.data) {
                this.draftList = res.data;
            }
        });
    }

    public initiateTransfer(data: Array<any>, uid: number) {
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
