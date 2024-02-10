import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup,UntypedFormBuilder,Validators,UntypedFormControl } from '@angular/forms';
import { AdminSandbox } from 'src/app/modules/admin/admin.sandbox';
@Component({
  selector: 'app-sgs-add-forms',
  templateUrl: './sgs-add-forms.component.html',
  styleUrls: ['./sgs-add-forms.component.scss']
})
export class SgsAddFormsComponent implements OnInit {  
  public addSchemeNamesForm!: UntypedFormGroup;
  selectedDate:any='';
  constructor(public dialogRef: MatDialogRef<SgsAddFormsComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,private sandBox: AdminSandbox,public fb: UntypedFormBuilder,
  ){}

  ngOnInit(): void {      
    this.addSchemeNamesForm = this.fb.group({
      scheme_start_date: new UntypedFormControl(null, Validators.required),
      scheme_id: new UntypedFormControl(this.data?.data?.scheme_id || null),
      scheme_name: new UntypedFormControl(null, Validators.required),
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
}
