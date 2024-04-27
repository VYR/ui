import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { OnlineShoppingComponent } from './online-shopping.component';


const routes: Routes = [
  {
    path : "",
    component : OnlineShoppingComponent
  }
   
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
    
  ],
  exports: [RouterModule]
})
export class OnlineShoppingRoutingModule { }
