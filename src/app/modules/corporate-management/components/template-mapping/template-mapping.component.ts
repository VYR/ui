import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';
import {
    DELIMITER_TYPE,
    CUSTOM_DATE_FORMAT_TYPE,
    TEMPLATE_FIELDS,
    TXN_TYPE_FIELDS,
    PURPOSE_CODE_DOMESTIC_FIELDS,
    PURPOSE_CODE_INTL_FIELDS,
} from '../../constants/meta-data';

import * as moment from 'moment';
interface TemplateMapping {
    form: FormGroup;
    controls: Array<any>;
    resCode: string;
    required: boolean;
}

@Component({
    selector: 'app-template-mapping',
    templateUrl: './template-mapping.component.html',
    styleUrls: ['./template-mapping.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
})
export class TemplateMappingComponent {
    delimiterType = DELIMITER_TYPE;
    dateFormatType = CUSTOM_DATE_FORMAT_TYPE;
    customHeaderList: any = [];
    customMapping: boolean = true;
    searchForm!: FormGroup;
    dateAndDelimiterForm!: FormGroup;
    mappings: Array<TemplateMapping> = [
        {
            form: new FormGroup({}),
            controls: TEMPLATE_FIELDS,
            resCode: 'templateMapping',
            required: true,
        },
        {
            form: new FormGroup({}),
            controls: TXN_TYPE_FIELDS,
            resCode: 'txnTypeMapping',
            required: false,
        },
        {
            form: new FormGroup({}),
            controls: PURPOSE_CODE_DOMESTIC_FIELDS,
            resCode: 'purposeCodeMapping',
            required: false,
        },
        {
            form: new FormGroup({}),
            controls: PURPOSE_CODE_INTL_FIELDS,
            resCode: 'purposeCodeMapping',
            required: false,
        },
    ];
    searched = false;
    templateResponse: any;
    inValidDate: string = 'Does not match with provide file Date Format';

    constructor(private fb: FormBuilder, private sandBox: CorporateManagementSandbox) {}

    ngOnInit() {
        this._buildForm();
    }

    private _buildForm() {
        this.searchForm = this.fb.group({
            searchRim: [null, [Validators.required]],
        });
        this.dateAndDelimiterForm = this.fb.group({
            fileDelimiter: [null],
            paymentDateFormat: [null],
        });

        this._buildMappingForm({});
    }

    searchForCustomTemplate() {
        this.sandBox.searchForCustomTemplate(this.searchForm.value.searchRim).subscribe((res: any) => {
            this.templateResponse = res.data;
            this.customHeaderList = res.data.customHeaderList;
            this.searched = true;
            this.dateAndDelimiterForm.patchValue({
                fileDelimiter: res.data.fileDelimiter,
                paymentDateFormat: res.data.paymentDateFormat,
            });
            this._buildMappingForm(res.data);
        });
    }

    private _buildMappingForm(data: any) {
        this.mappings.forEach((x: any) => {
            const group: any = {};
            x.controls.forEach((control: string) => {
                const controlValue = data[x.resCode] && data[x.resCode][control];
                let value = '';
                if (controlValue) {
                    value = controlValue.includes('@DEFAULT') ? controlValue.split('@DEFAULT')[1] : controlValue.trim();
                }
                group[control] = [value || null, x.required ? [Validators.required] : []];
            });
            x.form = this.fb.group(group);
        });
    }

    validateControl(form: FormGroup, control: string) {
        if (!(form && Object.keys(form.controls).length))
            return {
                valid: false,
                message: '',
            };

        return {
            valid: form.controls[control].valid,
            message: this._getMessage(form, control),
        };
    }

    private _getMessage(form: FormGroup, control: string) {
        const val = form.controls[control].value;
        if (!val) return 'You must map a header name or mention a default value';

        if (this.customHeaderList.includes(val)) {
            return 'Header name mapped';
        } else {
            if (control === 'Payment Date') {
                let valid = moment(
                    form.controls['Payment Date'].value,
                    this.dateAndDelimiterForm.value.paymentDateFormat,
                    true
                ).isValid();
                if (valid) {
                    return 'Default value set';
                } else {
                    return this.inValidDate;
                }
            } else {
                return 'Default value set';
            }
        }
    }

    validateOtherControl(form: FormGroup, control: string) {
        const val = form.controls[control].value;
        if (val) {
            return {
                valid: form.controls[control].valid,
                message: 'Value Mapped',
            };
        } else {
            return {
                valid: false,
                message: '',
            };
        }
    }

    onFileSelected(file: any) {
        this.sandBox.uploadCustomFile(file).subscribe((res: any) => {
            this.customHeaderList = res[0];
        });
    }

    getFilteredControls(value: any) {
        return this.customHeaderList.filter((x: string) =>
            (x || '').toLowerCase().trim().includes(value.toLowerCase().trim())
        );
    }

    updateTemplate() {
        const templateMapping = this.mappings[0].form.value;
        for (let x in templateMapping) {
            if (!this.customHeaderList.includes(templateMapping[x])) {
                templateMapping[x] = `@DEFAULT${templateMapping[x]}`;
            }
        }

        const txnTypeMapping: any = this.mappings[1].form.value;
        Object.keys(txnTypeMapping).forEach((v) => {
            if (!txnTypeMapping[v]) {
                delete txnTypeMapping[v];
            }
        });

        const purposeCodeDomesticMappingValue: any = this.mappings[2].form.getRawValue();
        Object.keys(purposeCodeDomesticMappingValue).forEach((v) => {
            if (!purposeCodeDomesticMappingValue[v]) {
                delete purposeCodeDomesticMappingValue[v];
            }
        });

        const purposeCodeIntlMappingValue: any = this.mappings[3].form.getRawValue();
        Object.keys(purposeCodeIntlMappingValue).forEach((v) => {
            if (!purposeCodeIntlMappingValue[v]) {
                delete purposeCodeIntlMappingValue[v];
            }
        });

        let payload = {
            rim: this.searchForm.value.searchRim,
            customMapping: true,
            active: true,
            paymentDateFormat: this.dateAndDelimiterForm.value.paymentDateFormat,
            fileDelimiter: this.dateAndDelimiterForm.value.fileDelimiter,
            customHeaderList: this.customHeaderList,
            templateMapping,
            txnTypeMapping,
            purposeCodeMapping: {
                ...purposeCodeDomesticMappingValue,
                ...purposeCodeIntlMappingValue,
            },
        };
        this.sandBox.updateTemplate(payload).subscribe((res: any) => {
            this.resetTemplate();
        });
    }

    resetTemplate() {
        this.searchForm.reset();
        this.searched = false;
        this.searchForm.controls['searchRim'].setErrors(null);
        this._buildMappingForm({});
    }
}
