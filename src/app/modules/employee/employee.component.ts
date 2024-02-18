import { Component, OnInit } from '@angular/core';
import { SuperEmployeeSandbox } from '../super-employee/super-empolyee.sandbox';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {


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



