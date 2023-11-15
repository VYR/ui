import { Component, OnInit } from '@angular/core';
import { CardsSandbox } from '../../cards.sandbox';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { CardBlockingDialogComponent } from '../card-blocking-dialog/card-blocking-dialog.component';
import { CARD_STATUS, CARD_TYPES, DECISION } from 'src/app/shared/enums';
import { UtilService } from 'src/app/utility/utility.service';
import { CardPopupDetailsComponent } from '../card-popup-details/card-popup-details.component';
import { CardDetails } from '../../model/cards.model';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-magstripe',
    templateUrl: './magstripe.component.html',
    styleUrls: ['./magstripe.component.scss'],
})
export class MagstripeComponent implements OnInit {
    public magstripForm!: UntypedFormGroup;
    tableConfig!: CIBTableConfig;
    public cols = [
        {
            key: 'country',
            displayName: 'Country',
        },
        {
            key: 'startDate',
            displayName: 'Valid From',
        },
        {
            key: 'endDate',
            displayName: 'Valid To',
        },
        {
            key: 'delete',
            displayName: '',
            type: ColumnType.icon,
            icon: 'la-trash-alt',
            callBackFn: this.checkForAction,
        },
    ];
    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };

    isAddBeneficiaryFormValid: boolean = true;
    countries: any[] = [];
    cardDetails: CardDetails = new CardDetails();
    magstrips: any[] = [];
    showForm = false;
    recurring = '';
    execTimes: any[] = [];
    minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
    validFromLabel = 'Valid From';
    validFrom = '';
    validToLabel = 'Valid To';
    validTo = '';
    DECISION = DECISION;
    CARD_STATUS = CARD_STATUS;
    currentUrl: string = '';

    constructor(
        public fb: UntypedFormBuilder,
        private sandBox: CardsSandbox,
        private dialog: CibDialogService,
        private utilService: UtilService
    ) {
        this.sandBox.selectedCard.subscribe((value: CardDetails) => {
            this.cardDetails = value;
            if (!this.cardDetails.isDebit) this.cardDetails.allowAction = true;
        });
    }

    ngOnInit(): void {
        const payload = {
            cardNumber: this.cardDetails.cardNumberUnmasked,
            cardType: this.cardDetails.cardName,
            expiryDate: this.cardDetails.expiryDate,
        };
        let call = this.cardDetails.isDebit
            ? this.sandBox.getDebitCardMagneticStripe(payload)
            : this.sandBox.getCardMagstripe(payload);
        forkJoin([this.sandBox.getCountry(), call]).subscribe((res: any) => {
            this.countries = res[0].data.sort((a: any, b: any) => a.country.localeCompare(b.country));
            this.setUpMagstripe(res[1]);
        });

        this.magstripForm = this.fb.group({
            country: [null, [Validators.required]],
            validFrom: [null, [Validators.required]],
            validTo: [null, [Validators.required]],
        });
        this.magstripForm.controls['validFrom'].setValue(this.minDate);
    }

    setUpMagstripe(data: any) {
        this.showForm = true;
        this.magstrips = [];
        this.magstripForm.controls['country'].setValue(null);
        this.magstripForm.controls['validTo'].setValue(null);

        if (this.cardDetails.isDebit) {
            this.magstrips = data.data.map((ac: any) => {
                return {
                    country: this.getCountryByCode(ac.countryCode).country, // TODO: Fetch country by country code
                    startDate: ac.travelFromDate,
                    endDate: ac.travelToDate,
                    index: ac.index,
                };
            });
        } else if (data.data?.alreadyActivated) this.magstrips.push(data.data?.activationDetails);

        this.showForm = this.magstrips.length === 0;

        this.tableConfig = {
            columns: this.cols,
            data: this.magstrips,
            selection: false,
            totalRecords: this.magstrips.length,
        };
    }

    checkForAction(data: any) {
        return !data.isDebit || (data.allowAction && data.isDebit);
    }

    getCountryByCode(code: number) {
        return this.countries.filter((c: any) => c.uncode === code)[0];
    }

    getCountryByName(name: string) {
        return this.countries.filter((c: any) => c.country === name)[0];
    }

    getValidFromDate(ev: any) {
        this.validFrom = ev;
    }
    getValidToDate(ev: any) {
        this.validTo = ev;
    }

    //Activate magstrip
    openPopUp(event: any) {
        const formData: any = this.magstripForm.value;
        let validToDate = this.validTo.split('-');

        const payLoad: any = {
            type: 'magstrip',
            details: {
                cardNumber: this.cardDetails.cardNumber,
                cardType: this.cardDetails.cardName,
                country: formData.country,
                validFrom: formData.validFrom,
                validTo: formData.validTo,
            },
            postParams: {
                action: 'activate',
                cardNumber: this.cardDetails.cardNumberUnmasked,
                cardType: this.cardDetails.cardName,
                country: formData.country,
                toDate: validToDate[2] + '-' + validToDate[1] + '-' + validToDate[0],
            },
        };

        if (this.cardDetails.isDebit) {
            payLoad.details['country'] = this.getCountryByCode(formData.country).country;
            payLoad['postParams'] = {
                action: 'ACTIVATE',
                cardNumber: this.cardDetails.cardNumberUnmasked,
                debitCardMaintenance: {
                    travelFromDate: moment(
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
                    ).format('YYYY-MM-DD'),
                    travelToDate: validToDate[2] + '-' + validToDate[1] + '-' + validToDate[0],
                    country: formData.country,
                    prodType: 'ALL',
                },
                expiryDate: this.cardDetails.expiryDate,
            };
        }

        const ref = this.dialog.openDrawer('Activation Summary', CardPopupDetailsComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                let call;
                if (this.cardDetails.isDebit) {
                    call = this.sandBox.deactivateDebitCardMagneticStripe(payLoad.postParams);
                } else {
                    call = this.sandBox.deactivateCardMagstripe(payLoad.postParams);
                }
                call.subscribe((response: any) => {
                    if (response.data) {
                        this.utilService.displayNotification('Magstripe is activated successfully!', 'success');
                        const payload = {
                            cardNumber: this.cardDetails.cardNumberUnmasked,
                            cardType: this.cardDetails.cardName,
                            expiryDate: this.cardDetails.expiryDate,
                        };
                        const call = this.cardDetails.isDebit
                            ? this.sandBox.getDebitCardMagneticStripe(payload)
                            : this.sandBox.getCardMagstripe(payload);
                        call.subscribe((res: any) => {
                            this.setUpMagstripe(res);
                        });
                    }
                });
            }
        });
    }

    //DeActivate magstrip
    onClickCell(event: any) {
        let req: any = {
            type: 'cardMagstripe',
            cardNumber: this.cardDetails.cardNumberUnmasked,
            cardType: this.cardDetails.cardName,
        };
        if (this.cardDetails.isDebit) {
            req['action'] = 'DEACTIVATE';
            req['expiryDate'] = this.cardDetails.expiryDate;
            req['debitCardMaintenance'] = {
                travelFromDate: event.data.startDate,
                travelToDate: event.data.endDate,
                country: this.getCountryByName(event.data.country).uncode,
                index: event.data.index,
                prodType: 'ALL',
            };
        } else {
            req['action'] = 'deactivate';
            req['country'] = event.data.country;
            req['toDate'] = event.data.endDate;
        }
        const ref = this.dialog.openDialog(CibDialogType.small, CardBlockingDialogComponent, req);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                let call;
                if (this.cardDetails.isDebit) {
                    call = this.sandBox.deactivateDebitCardMagneticStripe(result.data);
                } else {
                    call = this.sandBox.deactivateCardMagstripe(result.data);
                }
                call.subscribe((response: any) => {
                    if (
                        (!this.cardDetails.isDebit && response.data.alreadyActivated) ||
                        (this.cardDetails.isDebit && response.status === 'SUCCESS')
                    ) {
                        this.utilService.displayNotification('Magstripe is deactivated !', 'success');
                        this.showForm = true;
                        this.magstrips = [];
                        this.tableConfig = {
                            columns: this.cols,
                            data: this.magstrips,
                            selection: false,
                            totalRecords: this.magstrips.length,
                        };
                    }
                });
            }
        });
    }
}
