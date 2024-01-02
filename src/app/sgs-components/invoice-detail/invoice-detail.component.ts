import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-invoice-detail',
    templateUrl: './invoice-detail.component.html',
    styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent implements OnInit {
    invoiceForm!: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<InvoiceDetailComponent>,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.invoiceForm = this.fb.group({
            invoices: this.fb.array([this.newInvoice()]),
        });
    }

    get invoices(): FormArray {
        return this.invoiceForm.get('invoices') as FormArray;
    }

    newInvoice(): FormGroup {
        return this.fb.group({
            invoiceNumber: ['', Validators.required],
            amount: ['', Validators.required],
        });
    }

    addInvoices() {
        this.invoices.push(this.newInvoice());
    }

    removeInvoice(i: number) {
        if (this.invoices.length > 1) {
            this.invoices.removeAt(i);
        } else {
            this.invoices.at(i).reset();
        }
    }

    onSubmit() {
        const invoiceValues: { invoiceNumber: string; amount: number }[] = this.invoiceForm.value?.invoices;

        let invoiceValue: string = '1011//';
        invoiceValues.forEach((invoice) => {
            invoiceValue = invoiceValue + invoice.invoiceNumber + '(' + invoice.amount + ')';
        });

        this.dialogRef.close({ event: 'confirm', invoiceNumber: invoiceValue });
    }

    onConfirm() {
        this.dialogRef.close({ event: 'confirm' });
    }

    onCancel() {
        this.dialogRef.close({ event: 'cancel' });
    }
}
