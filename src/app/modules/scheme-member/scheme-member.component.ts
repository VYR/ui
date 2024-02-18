import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SchemeMemberSandbox } from './scheme-member.sandbox';

@Component({
  selector: 'app-scheme-member',
  templateUrl: './scheme-member.component.html',
  styleUrls: ['./scheme-member.component.scss']
})
export class SchemeMemberComponent implements OnInit {
  showSideMenu:boolean=true;
  
  refreshToken!: Subscription;
  constructor(private sandbox:SchemeMemberSandbox) { }

  ngOnInit(): void {
  }
  logout(){
    this.sandbox.logout().subscribe();
  }

  handleMenu(status:boolean){
    this.showSideMenu=status;
  }
  
  ngOnDestroy() {
    if (this.refreshToken) {
        this.refreshToken.unsubscribe();
    }
  }

}
