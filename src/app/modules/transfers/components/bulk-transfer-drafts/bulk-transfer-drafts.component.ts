import { Component, OnInit } from '@angular/core';
import { CIBTableConfig, CIBTableQuery } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION } from 'src/app/shared/enums';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { BULK_TRANSFER_DRAFTS_HEADER } from '../../constants/meta-data';
import { TransferSandbox } from '../../transfers.sandbox';
import { DeleteDraftDialogComponent } from '../delete-draft-dialog/delete-draft-dialog.component';

@Component({
    selector: 'app-bulk-transfer-drafts',
    templateUrl: './bulk-transfer-drafts.component.html',
    styleUrls: ['./bulk-transfer-drafts.component.scss'],
})
export class BulkTransferDraftsComponent implements OnInit {
    tableConfig!: CIBTableConfig;
    columns = BULK_TRANSFER_DRAFTS_HEADER;
    public draftList: any = [];
    DECISION = DECISION;
    constructor(public sandBox: TransferSandbox, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.getDraftsList();
    }

    getDraftsList() {
        this.sandBox.getDraftsList('bulk').subscribe((res: any) => {
            if (res.data) {
                this.draftList = res.data.map((x: any) => (x = { ...x.data[0], uid: x.uid }));
                this.loadDataTable(this.draftList);
            }
        });
    }

    loadDataTable(data: any) {
        this.tableConfig = {
            columns: this.columns,
            data,
            selection: false,
            totalRecords: data.length,
            clientPagination: true,
        };
    }

    onSelect(event: any) {}

    onClickCell(event: any) {
        if (event.key === 'delete') {
            this.deleteDraft(event);
        } else if (event.key === 'edit') {
            this.editDraft(event);
        }
    }

    deleteDraft(event: any) {
        const ref = this.dialog.openDialog(CibDialogType.small, DeleteDraftDialogComponent, event);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision === DECISION.CONFIRM) {
                this.sandBox.deleteDraftsRequest(result.data.data.uid).subscribe((res) => {
                    const index = this.tableConfig.data.findIndex((x: any) => x.uid === result.data.data.uid);
                    if (index !== -1) {
                        this.tableConfig.data.splice(index, 1);
                    }
                    this.tableConfig = {
                        ...this.tableConfig,
                    };
                });
            }
        });
    }

    editDraft(event: any) {
        this.sandBox.feedDraftData(event.data);
    }
}
