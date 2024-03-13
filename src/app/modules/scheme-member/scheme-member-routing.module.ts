import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemeMemberComponent } from './scheme-member.component';
import { SchemeDetailsComponent } from './components/scheme-details/scheme-details.component';
const routes: Routes = [
    {
        path: '',
        component:  SchemeMemberComponent,
        children:  [
            {
                path: 'scheme-details',
                component:SchemeDetailsComponent
            },
            {
                path: '',
                redirectTo: 'scheme-details',
                pathMatch: 'full',
            }
             
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SchemeMemberRoutingModule {}
