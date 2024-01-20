import { Component} from '@angular/core';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { USER_TYPES } from '../constants/meta-data';
import { OnlineFoodEditFormComponent } from '../online-food-edit-form/online-food-edit-form.component';

@Component({
  selector: 'app-online-food-profile',
  templateUrl: './online-food-profile.component.html',
  styleUrls: ['./online-food-profile.component.scss']
})
export class OnlineFoodProfileComponent{
  data!:UserContext;
  userTypes=USER_TYPES;
  constructor(private appContext: ApplicationContextService, private dialog: SgsDialogService) {
    this.appContext.setPageTitle('Profile'); 
    this.appContext.currentUser.subscribe((res: any) => (this.data = res));
  }
  openPopup() {    
    let data:any={...this.data,currentUserType:this.data.userType};
    data['role']=this.data.role;
    const ref = this.dialog.openOverlayPanel('Update Profile', 
    OnlineFoodEditFormComponent, {type:'users', data:data},SgsDialogType.medium);
    ref.afterClosed().subscribe((res) => {
        if(res?.id>0){
          this.data.organizationSelected={...this.data.organizationSelected,...res};
          this.data={...data,...res};
          this.appContext.setUserContext(this.data);
        }
    }); 
  }
}