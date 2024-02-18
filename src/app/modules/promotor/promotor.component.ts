import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromoterSandbox } from './promoter.sandbox';

@Component({
  selector: 'app-promotor',
  templateUrl: './promotor.component.html',
  styleUrls: ['./promotor.component.scss']
})
export class PromotorComponent implements OnInit {


  showSideMenu:boolean=true;
  
  refreshToken!: Subscription;
  constructor(private sandbox: PromoterSandbox) { }

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
