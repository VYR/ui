import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/shared/guards/role.guard';
import { HomeComponent } from './home.component';
import { OnlineFoodCategoriesComponent } from './components/online-food/online-food-categories/online-food-categories.component';
import { OnlineFoodImagesComponent } from './components/online-food/online-food-images/online-food-images.component';
import { OnlineFoodProductsComponent } from './components/online-food/online-food-products/online-food-products.component';
import { OnlineFoodOrdersComponent } from './components/online-food/online-food-orders/online-food-orders.component';
import { OnlineFoodUsersComponent } from './components/online-food/online-food-users/online-food-users.component';
import { OnlineFoodProfileComponent } from './components/online-food/online-food-profile/online-food-profile.component';
import { OnlineFoodSettingsComponent } from './components/online-food/online-food-settings/online-food-settings.component';
import { OnlineFoodSubCategoriesComponent } from './components/online-food/online-food-sub-categories/online-food-sub-categories.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'categories',
                component: OnlineFoodCategoriesComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'sub-categories',
                component: OnlineFoodSubCategoriesComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'images',
                component: OnlineFoodImagesComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'products',
                component: OnlineFoodProductsComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'orders',
                component: OnlineFoodOrdersComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'users',
                component: OnlineFoodUsersComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'profile',
                component: OnlineFoodProfileComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'settings',                
                component: OnlineFoodSettingsComponent,
                canLoad: [RoleGuard],
            },           
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
