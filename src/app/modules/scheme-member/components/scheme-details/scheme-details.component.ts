import { Component, OnInit } from '@angular/core';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SchemeMemberSandbox } from '../../scheme-member.sandbox';

@Component({
  selector: 'app-scheme-details',
  templateUrl: './scheme-details.component.html',
  styleUrls: ['./scheme-details.component.scss']
})
export class SchemeDetailsComponent implements OnInit {
  schemeMember!:any;
  currentUser!: UserContext;
  constructor(private appContext: ApplicationContextService, private sandbox: SchemeMemberSandbox) {
      this.appContext.currentUser.subscribe((res:any) => {
          this.currentUser = res;   
      });
  }

  ngOnInit(): void {
    this.getSgsUsers();
  }
  getSgsUsers() {       
      let query:any={};
      query.userType=0;    
      query.userId=this.currentUser.userId;
      this.sandbox.getSchemeMembers(query).subscribe((res: any) => {
          if(res?.data){
            const sortedData:Array<any>=res?.data?.data || [];
            if(sortedData.length>0)
            this.schemeMember=sortedData[0];
          }
      });    
  }
}
