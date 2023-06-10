import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './modules/landing/landing.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path:'', component: LandingComponent
  },
  {
    path:'home', 
    loadChildren : () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path:'share-market',
    loadChildren : () => import('./modules/share-market/share-market.module').then(m => m.ShareMarketModule)
  },
  {
    path:'**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({  
  declarations: [LandingComponent],
  imports: [RouterModule.forRoot(routes), SharedModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
