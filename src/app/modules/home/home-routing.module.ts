import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path:'', redirectTo : 'login', pathMatch:'prefix'
  },
  {
    path:'login', 
    component: LoginComponent
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
