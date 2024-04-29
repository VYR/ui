import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path : "online-exams",
    loadChildren : () => import("./modules/online-exams/online-exams.module").then((m) => m.OnlineExamsModule )
  },
  
  {
    path : "online-shopping",
    loadChildren : () => import("./modules/online-shopping/online-shopping.module").then((m) => m.OnlineShoppingModule )
  },
  {
    path :"**",
    redirectTo : "online-exams"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
