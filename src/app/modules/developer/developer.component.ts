import { Component, OnInit } from '@angular/core';
import { DeveloperSandbox } from './developer.sandbox';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent implements OnInit {

  showSideMenu:boolean=true;
  
  refreshToken!: Subscription;
  constructor(private sandbox:DeveloperSandbox) { }

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
