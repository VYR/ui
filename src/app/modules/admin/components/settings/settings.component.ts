import { Component, OnInit } from '@angular/core';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { AdminSandbox } from '../../admin.sandbox';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  data:any;
  constructor(private dialog:SgsDialogService,private sandbox:AdminSandbox) { }

  ngOnInit(): void {
    this.getSettings();
  }
  updateSettings(){
    const data={...this.data};
    const ref = this.dialog.openOverlayPanel('Update Settings ',
    SgsEditFormsComponent, {type:'settings', data:data},SgsDialogType.medium);
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
}
