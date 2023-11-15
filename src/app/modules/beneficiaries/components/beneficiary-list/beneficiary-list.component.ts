import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { BeneficiariesSandbox } from '../../beneficiaries.sandbox';
import { BeneficiaryDialogDetailsComponent } from '../beneficiary-dialog-details/beneficiary-dialog-details.component';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { MasterContainerComponent } from 'src/app/cib-components/master-container/master-container.component';

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
    constructor(
        private sandBox: BeneficiariesSandbox,
        private dialog: CibDialogService,
        private router: Router,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.getBeneficiaryList();
        this.getCountryList();
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
