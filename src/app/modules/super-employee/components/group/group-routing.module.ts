import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './group.component';
import { SchemesComponent } from './components/schemes/schemes.component';
const routes: Routes = [
    {
        path: '',
        component: GroupComponent,
        children: [
            {
                path: 'schemes',
                component:SchemesComponent
            },
            {
                path: '',
                redirectTo: 'schemes',
                pathMatch: 'full',
            }
             
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GroupRoutingModule {}
