import { Component, Input, OnInit } from '@angular/core';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { DECISION } from 'src/app/shared/enums';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { USER_TYPES } from '../constants/meta-data';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';

@Component({
  selector: 'app-sgs-profile',
  templateUrl: './sgs-profile.component.html',
  styleUrls: ['./sgs-profile.component.scss']
})
export class SgsProfileComponent {
  data!:UserContext;
  userTypes=USER_TYPES;
  constructor(private appContext: ApplicationContextService, private dialog: SgsDialogService) { 
    this.appContext.currentUser.subscribe((res: any) => (this.data = res));
  }
  openPopup() {    
    let data:any={...this.data,currentUserType:this.data.userType};
    data['role']=this.data.role;
    const ref = this.dialog.openOverlayPanel('Update Profile', 
    SgsEditFormsComponent, {type:'users', data:data},SgsDialogType.medium);
    ref.afterClosed().subscribe((res) => {
        if(res?.id>0){
          this.data.organizationSelected={...this.data.organizationSelected,...res};
          this.data={...data,...res};
          this.appContext.setUserContext(this.data);
        }
    }); 
  }
}
