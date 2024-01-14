import { Component, OnInit } from '@angular/core';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { UserContext } from 'src/app/shared/models';

@Component({
  selector: 'app-sgs-settings',
  templateUrl: './sgs-settings.component.html',
  styleUrls: ['./sgs-settings.component.scss']
})
export class SgsSettingsComponent implements OnInit {

  data:any;  
  constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox) { }

  ngOnInit(): void {
    this.sandbox.getSettings().subscribe((res:any) => {
      if(res.data)
      this.data=res.data;
    })
  }
  openPopup() {    
    let data:any={...this.data};
    const ref = this.dialog.openOverlayPanel('Update Settings', 
    SgsEditFormsComponent, {type:'settings', data:data},SgsDialogType.medium);
    ref.afterClosed().subscribe((res) => {
        if(res?.id>0){
          this.data=res;
        }
    }); 
  }
}
