import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { HomeSandbox } from '../../../home.sandbox';
@Component({
  selector: 'app-online-food-image-selection',
  templateUrl: './online-food-image-selection.component.html',
  styleUrls: ['./online-food-image-selection.component.scss']
})
export class OnlineFoodImageSelectionComponent implements OnInit{
  selectedFiles: any = [];
  imagePath:string='assets/images/image-preview.png';
  imagesList:Array<any>=[];
  isAddImage=false;
  DECISION = DECISION;
  constructor(private sandbox:HomeSandbox,
      public dialogRef: MatDialogRef<OnlineFoodImageSelectionComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(): void {
    const params:any={pageIndex:0,pageSize:30};
    this.sandbox.getFiles(params).subscribe((res:any) => {
      this.imagesList=res?.data?.data || [];
    });
  }



  
  onFileSelected(files: any, fileUpload: any) {
    //multiple files
    /*if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            this.selectedFiles.push(files[i]);
        }
    }
    fileUpload.file = null;*/
    if(files)
    this.selectedFiles=[files];
  else 
  this.selectedFiles.length=0;
  }
  isActive(image:any){
    this.imagesList=this.imagesList.map((value:any) => {
      value.active=(value.id===image.id)?!image.active:false;
      return value;
    });
      this.dialogRef.close({
        decision: DECISION.CONFIRM,
        data: image,
    });
  }
  deleteSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
  uploadFile(){
    let uploadFormData = new FormData();
    this.selectedFiles.forEach((file: any) => {
        uploadFormData.append('images', file);
    });
    this.sandbox.uploadFiles(uploadFormData).subscribe((res:any) => {
      if(res?.data){
        if(res?.data?.id>0){
          let image:any=res?.data || '';
          image.url=res?.url+res?.data?.path;
          image.active=false;
          this.imagesList.splice(0,0,image);
          this.selectedFiles=[];
        }
      }
    });
  }
}