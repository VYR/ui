import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder,Validators,UntypedFormControl } from '@angular/forms';
import { STATUSES } from "src/app/shared/constants/meta-data";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CustomDatePipe } from 'src/app/shared/pipes/date.pipe';
import { SuperEmployeeSandbox } from 'src/app/modules/super-employee/super-empolyee.sandbox';
@Component({
  selector: 'app-sgs-edit-forms',
  templateUrl: './sgs-edit-forms.component.html',
  styleUrls: ['./sgs-edit-forms.component.scss']
})
export class SgsEditFormsComponent implements OnInit {
  selectedDate:any='';
  public Editor = ClassicEditor;
  editorData:any=`<p>Hello, world!</p>`; 
  public updateSchemeNamesForm!: UntypedFormGroup;
  statuses:any=STATUSES;
  constructor(public dialogRef: MatDialogRef<SgsEditFormsComponent>, private datePipe:CustomDatePipe, 
      @Inject(MAT_DIALOG_DATA) public data: any, private sandBox: SuperEmployeeSandbox,public fb: UntypedFormBuilder,
  ){ }

  ngOnInit(): void {
    if(this.data?.data?.scheme_start_date)
    this.selectedDate=this.datePipe.transform(this.data?.data?.scheme_start_date,'YYYY-MM-dd');
    this.updateSchemeNamesForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      scheme_start_date: new UntypedFormControl(new Date(this.data?.data?.scheme_start_date || null), Validators.required),
      scheme_id: new UntypedFormControl(this.data?.data?.scheme_id || 0),
      scheme_name: new UntypedFormControl(this.data?.data?.scheme_name || 0, Validators.required),
      status: new UntypedFormControl(this.data?.data?.status || null),
    });
  }
  getDate(date:any){
    this.selectedDate=date;
  }

  submitSchemeNamesForm(){
    const formData=this.updateSchemeNamesForm.value;
    const payload:any={...formData,scheme_start_date:this.selectedDate};
    this.sandBox.addUpdateSchemeNames(payload).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  } 
}
