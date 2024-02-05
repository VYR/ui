import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./modules/public-access/public-access.module').then((m) => m.PublicAccessModule),
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
    },
    {
        path: 'service-unavailable',
        loadChildren: () =>
            import('./modules/service-unavailable/service-unavailable.module').then((m) => m.ServiceUnavailableModule),
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
