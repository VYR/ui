import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuperEmployeeSandbox } from './super-empolyee.sandbox';

@Component({
  selector: 'app-super-employee',
  templateUrl: './super-employee.component.html',
  styleUrls: ['./super-employee.component.scss']
})
export class SuperEmployeeComponent implements OnInit {

  showSideMenu:boolean=true;
  
  refreshToken!: Subscription;
  constructor(private sandbox:SuperEmployeeSandbox) { }

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

