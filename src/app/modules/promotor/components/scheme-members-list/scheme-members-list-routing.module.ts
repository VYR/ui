import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { GroupComponent } from './components/group/group.component';
import { SchemeMembersListComponent } from './scheme-members-list.component';
import { IndividualComponent } from './components/individual/individual.component';
const routes: Routes = [
    {
        path: '',
        component:SchemeMembersListComponent,
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
export class SchemeMembersListRoutingModule {}
