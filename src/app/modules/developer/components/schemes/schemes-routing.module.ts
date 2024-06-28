import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemesComponent } from './schemes.component';
import { IndividualComponent } from './components/individual/individual.component';
import { GroupComponent } from './components/group/group.component';
const routes: Routes = [
    {
        path: '',
        component:SchemesComponent,
        children: [
            {
                path: 'individual',
                component:IndividualComponent,
            },
            {
                path: 'group',
                component:GroupComponent,
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
export class SchemesRoutingModule {}
