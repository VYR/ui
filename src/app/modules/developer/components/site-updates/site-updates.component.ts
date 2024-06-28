import { Component, OnInit } from '@angular/core';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { DeveloperSandbox } from '../../developer.sandbox';
import { SiteUpdateEditorComponent } from '../site-update-editor/site-update-editor.component';

@Component({
  selector: 'app-site-updates',
  templateUrl: './site-updates.component.html',
  styleUrls: ['./site-updates.component.scss']
})
export class SiteUpdatesComponent implements OnInit {

  selectedWebsite = 0;

  websites = [
    { id:1, name:"Vi Bullion" },
    { id:2, name:"Save Gold" },
    { id:3, name:"Save Gold Scheme" },
    { id:4, name:"Jewellery" }
  ];
  
  data:any;
  constructor(private dialog:SgsDialogService,private sandbox:DeveloperSandbox) { }

  ngOnInit(): void {
    // this.getSettings();
  }
  updateSettings(){
    const data={...this.data};
    const ref = this.dialog.openOverlayPanel('Update  ' + this.websites.filter((d:any)=>d.id===this.selectedWebsite)[0].name,
    SiteUpdateEditorComponent, {type:'settings', data:data},SgsDialogType.large);
    ref.afterClosed().subscribe((res) => {
        if(res?.id>0)
        this.getSettings();
    }); 
  }
  getSettings(){
  this.sandbox.getSettings().subscribe(
    (res:any)=>{
      console.log(res);
      if (res?.data){
        this.data=res.data.data;
      }
    }
  );
  }

  getWebsite(param1:any,param2:any){
    
  }
 

}
