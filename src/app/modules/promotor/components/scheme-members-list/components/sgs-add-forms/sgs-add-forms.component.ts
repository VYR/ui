import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup,UntypedFormBuilder,Validators,UntypedFormControl } from '@angular/forms';
import { PromoterSandbox } from '../../../../promoter.sandbox';
@Component({
  selector: 'app-sgs-add-forms',
  templateUrl: './sgs-add-forms.component.html',
  styleUrls: ['./sgs-add-forms.component.scss']
})
export class SgsAddFormsComponent implements OnInit {  
  public addSchemeNamesForm!: UntypedFormGroup;
  public addPaymentForm!: UntypedFormGroup;
  selectedDate:any='';
  constructor(public dialogRef: MatDialogRef<SgsAddFormsComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,private sandBox: PromoterSandbox,public fb: UntypedFormBuilder,
  ){}

  ngOnInit(): void {      
    this.addSchemeNamesForm = this.fb.group({
      scheme_start_date: new UntypedFormControl(null, Validators.required),
      scheme_id: new UntypedFormControl(this.data?.data?.scheme_id || null),
      scheme_name: new UntypedFormControl(null, Validators.required),
    });
        
    this.addPaymentForm = this.fb.group({
      scheme_member_id: new UntypedFormControl(this.data?.data?.scheme_member_id || 0),
      scheme_id: new UntypedFormControl(this.data?.data?.scheme_id || 0),
      amount_paid: new UntypedFormControl(this.data?.data?.amount_paid || 0),
      month_paid: new UntypedFormControl(this.data?.data?.month_paid || 0),
    });
  }
  getDate(date:any){
    this.selectedDate=date;
  }
  submitSchemeNamesForm(){
    const formData=this.addSchemeNamesForm.value;
    const payload:any={...formData,scheme_start_date:this.selectedDate};
    this.sandBox.addUpdateSchemeNames(payload).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
  submitPaymentForm(){
    const formData:any=this.addPaymentForm.value;
    formData.amount_paid=parseFloat(formData.amount_paid);
    this.sandBox.addUpdatePayment(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
}
