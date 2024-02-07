import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualComponent } from './individual.component';
import { SchemesComponent } from './components/schemes/schemes.component';
const routes: Routes = [
    {
        path: '',
        component: IndividualComponent,
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
export class IndidualRoutingModule {}
