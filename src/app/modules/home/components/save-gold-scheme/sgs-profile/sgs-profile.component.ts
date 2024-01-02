import { Component, Input, OnInit } from '@angular/core';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { DECISION } from 'src/app/shared/enums';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';

@Component({
  selector: 'app-sgs-profile',
  templateUrl: './sgs-profile.component.html',
  styleUrls: ['./sgs-profile.component.scss']
})
export class SgsProfileComponent {
  data!:UserContext;
  @Input() settings!:any;
  @Input() type=1;
  constructor(private appContext: ApplicationContextService, private dialog: SgsDialogService) { 
    this.appContext.currentUser.subscribe((res: any) => (this.data = res));
  }
  openPopup() {
   this.data={...this.data,...this.settings};
    const ref = this.dialog.openOverlayPanel(this.type===1?'Update Profile':'Update Settings', SgsUpdateUserComponent, {
        mode: DECISION.ADD,
        type:this.type,
        data: this.data,
    },SgsDialogType.medium);
    ref.afterClosed().subscribe((res) => {});
  
}
}
