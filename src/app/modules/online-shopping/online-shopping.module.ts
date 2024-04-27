import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineShoppingComponent } from './online-shopping.component';
import { OnlineShoppingRoutingModule } from "./online-shopping-routing.module";


@NgModule({
  declarations: [
    OnlineShoppingComponent
  ],
  imports: [
    CommonModule,
    OnlineShoppingRoutingModule
  ]
})
export class OnlineShoppingModule { }
