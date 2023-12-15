import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { BeneficiariesSandbox } from '../../beneficiaries.sandbox';
import { BeneficiaryDialogDetailsComponent } from '../beneficiary-dialog-details/beneficiary-dialog-details.component';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { MasterContainerComponent } from 'src/app/cib-components/master-container/master-container.component';
import { CIBTableConfig, ColumnType, SortDirection } from 'src/app/cib-components/cib-table/models/config.model';

@Component({
    selector: 'app-beneficiary-list',
    templateUrl: './beneficiary-list.component.html',
    styleUrls: ['./beneficiary-list.component.scss'],
})
export class BeneficiaryListComponent implements OnInit {
    beneficiaryList: any = [];
    filteredbeneficiaryList: any = [];
    filteredbeneficiaryBasedOnTypeList: any = [];
    activeIndex: number = 0;
    showsearch = false;
    searchKey: String = '';
    countryList: any = [];
    showEdit = false;
    selectedType: string = 'All';
    beneficiaryTypes: any = ['All', 'WQIB', 'WQAR', 'INTL'];
    @ViewChild('beneList') beneList!: MasterContainerComponent;

    selectedCountry: string = 'All';
    public options: Array<any> = [
        {
            uuid: 'BENEFICIARY_DELETE',
            name: 'la-trash-alt',
            fnName: 'delete',
        },
        {
            uuid: 'BENEFICIARY_UPDATE',
            name: 'la-user-edit',
            fnName: 'edit',
        },
    ];
    tableConfig!: CIBTableConfig;
   // public filterForm!: FormGroup;
    public cols = [
        {
            key: 'id',
            displayName: 'ID',
            sortable: true,
        },
        {
            key: 'category',
            displayName: 'Category',
            sortable: true,
        },
        {
            key: 'name',
            displayName: ' NAME',
            sortable: true,
            type:ColumnType.link
        },
        {
            key: 'currency',
            displayName: 'Currency',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'AMOUNT',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            sortable: true,
            type:ColumnType.status
        },
        {
            key: 'edit',
            displayName: 'EDIT ',
            type: ColumnType.icon,
            icon: 'la-edit',
            UUID: 'TRADEFINANCE_IMPORT_LC_UPDATE',
        },
        {
            key: 'delete',
            displayName: 'DELETE ',
            type: ColumnType.icon,
            icon: 'la-trash',
            UUID: 'TRADEFINANCE_IMPORT_LC_DELETE',
        },
    ];
    lcdocuments:Array<any>=[];
    constructor(
        private sandBox: BeneficiariesSandbox,
        private dialog: CibDialogService,
        private router: Router,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.getLcDrafts();
        this.getCountryList();
    }

    public getLcDrafts() {
        //this.filterForm.reset();
       // this.sandBox.getLcDrafts().subscribe((response: any) => {
        const response:any={data:[
            {
                id:1,
                category:"Biryani",
                name:'Hyderabadi Chicken dum biryani',
                currency:'INR',
                amount:234.50,
                status:'active'
            },
            {
                id:2,
                category:"Biryani",
                name:'Hyderabadi Chicken dum biryani',
                currency:'INR',
                amount:234.50,
                status:'active'
            }
        ]};
            if (response.data) {
                this.lcdocuments = response.data;
                // this.lcdocuments.forEach((item: any) => {
                //     item.lcBeneficiaryName = item.lcAdvicingBankDetails?.lcBeneficiaryName;
                //     item.lcProductType = item.lcbasicDetails?.lcProductType;
                //     item.lcExpiryDate = item.lcbasicDetails?.lcExpiryDate;
                //     item.statusDesc = item.lcStatusBean?.statusDesc;
                //     item.updated = item.updated || item.created;
                // });
                this.lazyLoad({ sortKey: 'updated', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });
            }
       // });
    }

    loadDataTable() {
        this.tableConfig = {
            columns: this.cols,
            data: this.lcdocuments,
            selection: false,
            totalRecords: this.lcdocuments.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.lcdocuments = this.lcdocuments.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onClickCell(event: any) {
        if (event.key === 'delete') {
            let data = {
                header: '<div>Delete Draft</div>',
                body: '<div>Would you like to delete this draft?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.deleteDraft(event.data);
                }
            });
        } else if (event.key === 'edit') {
            let data = {
                header: '<div>Edit Draft</div>',
                body: '<div>Would you like to edit this LC?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    // this.sandBox.setLcRequest({ type: 'lcDrafts', data: event.data || [] });
                    // this.router.navigate([APP_ROUTES.REQUEST_LC]);
                }
            });
        }
    }

    deleteDraft(rowData: any) {
        // this.sandBox.deleteLcDrafts(rowData.applnId).subscribe((response: any) => {
        //     if (response.status === 'SUCCESS') {
        //         this.getLcDrafts();
        //     }
        // });
    }
    public getBeneficiaryList() {
        this.sandBox.getBeneficiaryList().subscribe((res: any) => {
            this.beneficiaryList = _.orderBy(res.data, ['nickName']);
            this.filteredbeneficiaryList = this.filteredbeneficiaryBasedOnTypeList = this.beneficiaryList;
        });
    }

    public getCountryList() {
        this.sandBox.getCountryList().subscribe((res: any) => {
            this.countryList = res.countries;
        });
    }

    public showSearch() {
        this.showsearch = !this.showsearch;
        this.beneList.body.nativeElement.scrollTop = 0;
    }

    getCountryName(countryCode: string) {
        return this.utilService.getNameFromList(countryCode, this.countryList, 'name', 'code');
    }

    public onAction(actionName: string) {
        if (actionName === 'edit') this.showEdit = true;
        else if (actionName === 'delete') {
            let data = {
                header: '<div>Beneficiary Delete</div>',
                body: '<div>Any pending transfers would be rejected. Please confirm Delete of Beneficiary ?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.large, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.okToDelete('VERIFY');
                }
            });
        }
    }

    /**
     * Delete beneficiary
     */
    public okToDelete(action: string, otp?: string) {
        var payload = {
            beneficiaryId: this.beneficiaryList[this.activeIndex].beneficiaryId,
            action: action,
            validateOTPRequest: otp ? { softTokenUser: false, otp: otp } : {},
        };
        this.sandBox.deleteBeneficiary(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                var beneficiaryData = {
                    title: 'Beneficiary Delete',
                    nickName: this.beneficiaryList[this.activeIndex].nickName,
                    iban: this.beneficiaryList[this.activeIndex].iban,
                    accountNo: this.beneficiaryList[this.activeIndex].accountNo,
                    currency: this.beneficiaryList[this.activeIndex].currency,
                    bankName: this.beneficiaryList[this.activeIndex].bankName,
                    bankCountry: this.getCountryName(this.beneficiaryList[this.activeIndex].bankCountry),
                };
                const dialogRef = this.dialog.openDrawer(
                    `Request Summary - ${beneficiaryData.title}`,
                    BeneficiaryDialogDetailsComponent,
                    beneficiaryData
                );
                dialogRef.afterClosed().subscribe((result: any) => {
                    if (result.event === 'confirm') {
                        this.okToDelete('CONFIRM', result.data);
                    }
                });
            } else {
                if (res.status === 'SUCCESS') {
                    this.utilService.displayNotification('Beneficiary deleted successfully!', 'success');
                }
                //this.ngOnInit();
                this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['home/beneficiaries/beneficiary-list']);
                });
            }
        });
    }

    public filterListByNickname() {
        if (this.searchKey != '') {
            this.beneficiaryList = this.filteredbeneficiaryBasedOnTypeList.filter(
                (item: any) => item.nickName.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1
            );
        }
    }

    public filterListByCountry(searchString: any) {
        if (searchString.value === 'All') {
            this.beneficiaryList = this.filteredbeneficiaryBasedOnTypeList;
        } else {
            this.beneficiaryList = this.filteredbeneficiaryBasedOnTypeList.filter(
                (item: any) => item.bankCountry.toLowerCase().indexOf(searchString.value.code.toLowerCase()) > -1
            );
        }
    }

    public filterListByType(type: string) {
        this.searchKey = '';
        this.selectedCountry = 'All';
        this.selectedType = type;
        switch (type) {
            case 'All':
                this.beneficiaryList = this.filteredbeneficiaryList;
                break;
            case 'WQAR':
                this.beneficiaryList = this.filteredbeneficiaryList.filter(
                    (item: any) => item.payeeType.indexOf(type) > -1
                );
                break;
            case 'WQIB':
                this.beneficiaryList = this.filteredbeneficiaryList.filter(
                    (item: any) => item.payeeType.indexOf(type) > -1
                );
                break;
            case 'INTL':
                this.beneficiaryList = this.filteredbeneficiaryList.filter(
                    (item: any) => item.payeeType.indexOf(type) > -1
                );
                break;
        }
        this.filteredbeneficiaryBasedOnTypeList = this.beneficiaryList;
    }
}
