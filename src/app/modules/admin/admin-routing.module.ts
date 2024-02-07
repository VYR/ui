import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'individual',
                loadChildren: () => import('./components/individual/individual.module').then((m) => m.IndividualModule),
            },
            {
                path: 'group',
                loadChildren: () => import('./components/group/group.module').then((m) => m.GroupModule),
            },
            {
                path: '',
                redirectTo: 'individual',
                pathMatch: 'full',
            }
             
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
