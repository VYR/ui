import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import { HomeSandbox } from '../../../home.sandbox';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Component({
  selector: 'app-online-food-images',
  templateUrl: './online-food-images.component.html',
  styleUrls: ['./online-food-images.component.scss']
})
export class OnlineFoodImagesComponent implements OnInit {

  selectedFiles: any = [];
  imagePath:string='assets/images/image-preview.png';
  imagesList:Array<any>=[];
  isAddImage=false;
  @Input() isSelection: boolean=false;
  @Output() _onSelect: EventEmitter<any> = new EventEmitter<any>();
  constructor(private dialog: SgsDialogService, private sandbox:HomeSandbox, private appContext:ApplicationContextService) {
    if(!this.isSelection)
    this.appContext.setPageTitle('Images');   }

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
    if(this.isSelection){
      this._onSelect.emit(image);
    }
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
  deleteRequest(image: any,index:any) {
    const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, 'File');
    ref.afterClosed().subscribe((result: any) => {
        if (result.decision === DECISION.CONFIRM) {
            this.sandbox.deleteRequest({id:image.id,type:5}).subscribe((res:any) => {
                if(res?.deleteStatus === 1)
                {
                  this.imagesList.splice(index,1);
                }
            });
        }
    });
  }
}
