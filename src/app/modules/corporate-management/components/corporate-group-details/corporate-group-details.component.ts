import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';

@Component({
    selector: 'app-corporate-group-details',
    templateUrl: './corporate-group-details.component.html',
    styleUrls: ['./corporate-group-details.component.scss'],
})
export class CorporateGroupDetailsComponent implements OnInit {
    public addGroupForm!: UntypedFormGroup;
    public searchForm!: UntypedFormGroup;
    @Input() corporateGroupDetails!: any;
    @Input() selectedFeatureType: any;
    title: string = 'ADD GROUP';
    tableConfigMappedRim: CIBTableConfig = new CIBTableConfig();
    tableConfigSearchedRim: CIBTableConfig = new CIBTableConfig();
    rimList: any = [];
    public mapRimCols: any = [
        {
            key: 'rimnumber',
            displayName: 'Rim Number',
            sortable: true,
        },
        {
            key: 'firstnameeng',
            displayName: 'Corporate Name',
            sortable: true,
        },
    ];

    public addRimCols = [
        {
            key: 'rimnumber',
            displayName: 'Rim Number',
            sortable: true,
        },
        {
            key: 'firstnameeng',
            displayName: 'Corporate Name',
            sortable: true,
        },
    ];
    corporateRims: any = [];
    mappedRims: any = [];
    @ViewChild('menuTrigger') trigger: any;
    @Output() closeDetails: EventEmitter<any> = new EventEmitter<any>();
    corporateRimsSelected: any = [];
    constructor(
        public fb: UntypedFormBuilder,
        private sandBox: CorporateManagementSandbox,
        private dialogService: CibDialogService
    ) {}

    ngOnInit(): void {
        this.rimList = [];
        this.addGroupForm = this.fb.group({
            groupName: [null, [Validators.required]],
            groupDescription: [null, [Validators.required]],
            searchRim: [null],
        });
        if (this.corporateGroupDetails === undefined) {
            this.title = 'ADD GROUP';
        } else {
            if (this.selectedFeatureType === 'VIEW') {
                this.title = 'GROUP DETAILS';
                this.getRimsForCorporateGroup(this.corporateGroupDetails.businessId);
            }
            if (this.selectedFeatureType === 'EDIT') {
                this.title = 'UPDATE GROUP';
                this.addGroupForm.patchValue({
                    groupName: this.corporateGroupDetails.businessName,
                    groupDescription: this.corporateGroupDetails.businessNameArabic,
                });
                this.getRimsForCorporateGroup(this.corporateGroupDetails.businessId);
            }
        }
    }

    getRimsForCorporateGroup(businessId: any) {
        this.sandBox.getRimsForCorporateGroup(businessId).subscribe((res: any) => {
            this.mappedRims = res.data;
            if (this.selectedFeatureType === 'EDIT') {
                this.mapRimCols.push({
                    key: 'delete',
                    displayName: 'DELETE',
                    type: ColumnType.icon,
                    icon: 'la-trash-alt',
                });
            }
            this.tableConfigMappedRim = {
                columns: this.mapRimCols,
                data: this.mappedRims,
                selection: false,
                totalRecords: this.mappedRims.length || 0,
                clientPagination: true,
            };
        });
    }

    onClickCell(event: any) {
        if (event.key === 'delete') {
            let data = {
                header: '<div>Delete Corporate Group</div>',
                body: '<div>Would you like to delete this corporate?</div>',
            };
            let dialogRef = this.dialogService.openDialog(CibDialogType.medium, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    let payload = {
                        businessId: this.corporateGroupDetails.businessId,
                        businessName: this.corporateGroupDetails.businessName,
                        rim: event.data.rimnumber,
                    };
                    this.sandBox.deleteCorporateMappedRim(payload).subscribe((res: any) => {
                        this.closeDetails.emit();
                    });
                }
            });
        }
    }

    getRimsOnSearch() {
        if (this.corporateRims.length > 0) {
            let corporateRimCheck = this.corporateRims.find((rimsInfo: any) => {
                return rimsInfo.rimnumber === this.addGroupForm.value.searchRim;
            });
            if (corporateRimCheck === undefined) {
                this.addRims(this.addGroupForm.value.searchRim);
            } else {
                this.addGroupForm.controls['searchRim'].setErrors({ incorrect: true });
            }
        } else {
            this.addRims(this.addGroupForm.value.searchRim);
        }
    }

    addRims(rim: any) {
        this.sandBox.getRimsOnSearch(rim).subscribe((res: any) => {
            this.corporateRimsSelected = [];
            this.rimList =
                this.mappedRims.length > 0
                    ? res.data.filter((obj: any) => {
                          return obj.rimnumber.indexOf(this.formatBuisnessRimData(this.mappedRims)) === -1;
                      })
                    : res.data || [];

            if (this.rimList.length > 0) {
                this.corporateRims.push(this.rimList[0]);
            }

            this.trigger.closeMenu();

            this.tableConfigSearchedRim = {
                columns: this.addRimCols,
                data: this.corporateRims,
                selection: true,
                totalRecords: this.corporateRims.length || 0,
                clientPagination: true,
            };
            this.addGroupForm.controls['searchRim'].setValue('');
        });
    }

    closeMatmenu() {
        this.trigger.closeMenu();
    }

    closeCorporateGroupDetails() {
        this.closeDetails.emit();
    }

    onSelect(selectedRimData: any) {
        this.corporateRimsSelected = selectedRimData;
    }

    addORUpdateCorporateGroup() {
        let allBuisnessRims = [...this.mappedRims, ...this.corporateRimsSelected];
        let formatedBuisnessRims = this.formatBuisnessRimData(allBuisnessRims);
        if (this.selectedFeatureType === 'EDIT') {
            let payload = {
                businessName: this.addGroupForm.value.groupName,
                businessNameArabic: this.addGroupForm.value.groupDescription,
                businessId: this.corporateGroupDetails.businessId,
                businessRim: formatedBuisnessRims,
            };
            this.sandBox.updateCorporateGroup(payload).subscribe((res: any) => {
                this.closeDetails.emit();
            });
        } else {
            let data = {
                header: '<div>Create Corporate Group</div>',
                body: '<div>Would you like to create corporate group?</div>',
            };
            let dialogRef = this.dialogService.openDialog(CibDialogType.medium, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    let payload = {
                        businessName: this.addGroupForm.value.groupName,
                        businessNameArabic: this.addGroupForm.value.groupDescription,
                        businessRim: formatedBuisnessRims,
                    };
                    this.sandBox.addCorporateGroup(payload).subscribe((res: any) => {
                        this.closeDetails.emit();
                    });
                }
            });
        }
    }

    formatBuisnessRimData(rimsData: any) {
        let formattedRimData: any = [];
        rimsData.map((rim: any) => {
            formattedRimData.push(rim.rimnumber);
        });
        return formattedRimData;
    }
}
