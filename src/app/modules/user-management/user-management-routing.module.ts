import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { SearchUserComponent } from './components/search-user/search-user.component';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
    {
        path: '',
        component: UserManagementComponent,
        children: [
            {
                path: 'search',
                component: SearchUserComponent,
            },
            {
                path: 'create-user',
                component: CreateUserComponent,
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
export class UserManagementRoutingModule {}
