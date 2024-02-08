import { Component, OnInit } from '@angular/core';
import { AdminSandbox } from './admin.sandbox';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  showSideMenu:boolean=true;
  
  refreshToken!: Subscription;
  constructor(private sandbox:AdminSandbox) { }

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
