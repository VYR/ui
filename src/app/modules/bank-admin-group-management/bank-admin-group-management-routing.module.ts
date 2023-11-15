import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BankAdminGroupManagementComponent } from './bank-admin-group-management.component';
import { SearchComponent } from './components/search/search.component';
import { CreateComponent } from './components/create/create.component';
import { MappingsComponent } from './components/mappings/mappings.component';
import { MatrixComponent } from './components/matrix/matrix.component';
const routes: Routes = [
    {
        path: '',
        component: BankAdminGroupManagementComponent,
        children: [
            {
                path: 'search',
                component: SearchComponent,
            },
            {
                path: 'create',
                component: CreateComponent,
            },
            {
                path: 'mappings',
                component: MappingsComponent,
            },
            {
                path: 'matrix',
                component: MatrixComponent,
            },
            {
                path: '',
                redirectTo: 'search',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BankAdminGroupManagementRoutingModule {}
