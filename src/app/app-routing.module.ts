import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [    
    {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./modules/authentication/authentication.module').then((m) => m.AuthenticationModule),
    },
    {
        path: 'service-unavailable',
        loadChildren: () =>
            import('./modules/service-unavailable/service-unavailable.module').then((m) => m.ServiceUnavailableModule),
    },
    {
        path: '**',
        redirectTo: '/landing',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
