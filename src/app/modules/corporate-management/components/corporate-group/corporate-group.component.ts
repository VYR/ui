import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';

@Component({
    selector: 'app-corporate-group',
    templateUrl: './corporate-group.component.html',
    styleUrls: ['./corporate-group.component.scss'],
})
export class CorporateGroupComponent implements OnInit {
    public searchForm!: UntypedFormGroup;
    tableConfig: CIBTableConfig = new CIBTableConfig();
    public cols = [
        {
            key: 'businessId',
            displayName: 'GROUP ID',
            sortable: true,
        },
        {
            key: 'businessName',
            displayName: 'GROUP NAME',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'businessNameArabic',
            displayName: 'GROUP ARABIC NAME',
            sortable: true,
        },
        {
            key: 'edit',
            displayName: 'EDIT',
            type: ColumnType.icon,
            icon: 'la-edit',
        },
        {
            key: 'delete',
            displayName: 'DELETE',
            type: ColumnType.icon,
            icon: 'la-trash-alt',
        },
    ];
    selectedCorporateGroup!: any;
    corporatesGroupList: any = [];
    showGroupDetails: boolean = false;
    selectedFeatureType: string = 'VIEW';
    constructor(
        public fb: UntypedFormBuilder,
        private sandBox: CorporateManagementSandbox,
        private dialogService: CibDialogService,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.searchForm = this.fb.group({
            groupName: [null, [Validators.required]],
        });
    }

    addGroup() {
        this.showGroupDetails = true;
        this.selectedFeatureType = 'ADD';
        this.selectedCorporateGroup = undefined;
    }

    searchForCorporateGroup() {
        this.resetTable();
        this.sandBox.searchForCorporateGroup(this.searchForm.value.groupName).subscribe((res: any) => {
            this.corporatesGroupList = res.data || [];
            this.tableConfig = {
                columns: this.cols,
                data: this.corporatesGroupList,
                selection: false,
                totalRecords: this.corporatesGroupList.length || 0,
                clientPagination: true,
            };
        });
    }

    onClickCell(event: any) {
        this.selectedCorporateGroup = event.data;
        if (event.key === 'businessName') {
            this.showGroupDetails = true;
            this.selectedFeatureType = 'VIEW';
        } else if (event.key === 'edit') {
            this.selectedFeatureType = 'EDIT';
            this.showGroupDetails = true;
        } else if (event.key === 'delete') {
            let data = {
                header: '<div>Delete Corporate Business Group</div>',
                body: '<div>Would you like to delete this Corporate Business Group?</div>',
            };
            let dialogRef = this.dialogService.openDialog(CibDialogType.medium, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox
                        .deleteCorporateGroup(event.data.businessId, event.data.businessName)
                        .subscribe((res: any) => {
                            this.utilService.displayNotification(`Request has been sent for approval`, 'success');
                        });
                }
            });
        }
    }

    closeDetails() {
        this.showGroupDetails = false;
    }

    resetGroup() {
        this.searchForm.reset();
        this.searchForm.controls['groupName'].setErrors(null);
    }

    resetTable() {
        this.corporatesGroupList = [];
        this.tableConfig = {
            columns: this.cols,
            data: this.corporatesGroupList,
            selection: false,
            totalRecords: this.corporatesGroupList.length || 0,
            clientPagination: true,
        };
    }
}
