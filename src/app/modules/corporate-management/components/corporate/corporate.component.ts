import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';

@Component({
    selector: 'app-corporate',
    templateUrl: './corporate.component.html',
    styleUrls: ['./corporate.component.scss'],
})
export class CorporateComponent implements OnInit {
    public searchForm!: UntypedFormGroup;
    corporatesList: any = [];
    tableConfig: CIBTableConfig = new CIBTableConfig();
    public cols = [
        {
            key: 'firstnameeng',
            displayName: 'FIRST NAME',
        },
        {
            key: 'lastnameeng',
            displayName: 'LAST NAME',
        },
        {
            key: 'businessemailid',
            displayName: 'EMAIL ID',
        },
        {
            key: 'mandateUploaded',
            displayName: 'REGISTERED',
        },
        {
            key: 'rimnumber',
            displayName: 'RIM No.',
            type: ColumnType.link,
        },
        {
            key: 'edit',
            displayName: 'EDIT',
            type: ColumnType.icon,
            icon: 'la-edit',
        },
    ];
    showDetails: boolean = false;
    showEdit: boolean = false;
    selectedCorporate!: any;

    constructor(public fb: UntypedFormBuilder, private sandBox: CorporateManagementSandbox) {}

    ngOnInit(): void {
        this.searchForm = this.fb.group({
            rim: [null, [Validators.required]],
        });
    }

    searchForCorporate() {
        this.resetTable();
        this.sandBox.searchForCorporate(this.searchForm.value.rim).subscribe((res: any) => {
            this.corporatesList = res.data || [];
            this.corporatesList.forEach((corporate: any) => {
                corporate.mandateUploaded = corporate.customerMandate?.mandateUploaded === 'Y' ? 'YES' : 'NO';
                if (corporate.businessemailid)
                    corporate.businessemailid = corporate.businessemailid.split(' ').join(',');
            });
            this.tableConfig = {
                columns: this.cols,
                data: this.corporatesList,
                selection: false,
                totalRecords: this.corporatesList.length || 0,
            };
        });
    }

    onClickCell(event: any) {
        this.selectedCorporate = event.data;
        if (event.key === 'rimnumber') {
            this.showEdit = false;
            this.showDetails = !this.showDetails;
        } else if (event.key === 'edit') {
            this.showEdit = true;
            this.showDetails = !this.showDetails;
        }
    }

    resetGroup() {
        this.searchForm.reset();
        this.searchForm.controls['rim'].setErrors(null);
        this.resetTable();
    }

    resetTable() {
        this.corporatesList = [];
        this.tableConfig = {
            columns: this.cols,
            data: this.corporatesList,
            selection: false,
            totalRecords: this.corporatesList.length || 0,
        };
    }
}
