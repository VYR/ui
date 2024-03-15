import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/shared/guards/role.guard';
import { PublicAccessComponent } from './public-access.component';
import { PublicAccessHomeComponent } from './components/public-access-home/public-access-home.component';
import { PublicAccessContactComponent } from './components/public-access-contact/public-access-contact.component';
import { PublicAccessAboutComponent } from './components/public-access-about/public-access-about.component';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

const routes: Routes = [
    {
        path: '',
        component: PublicAccessComponent,
        children: [
            {
                path: '',
                component: PublicAccessHomeComponent
            },
            {
                path: 'product',
                component: ProductComponent
            },
            {
                path: 'detail',
                component: ProductDetailComponent
            },
            {
                path: 'checkout',
                component: CheckoutComponent
            },
            {
                path: 'cart',
                component: CartComponent
            },
            {
                path: 'about-us',
                component: PublicAccessAboutComponent
            },
            {
                path: 'contact-us',
                component: PublicAccessContactComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },            
            {
                path: 'login-admin',
                loadChildren: () =>
                    import('../../modules/authentication/authentication.module').then((m) => m.AuthenticationModule),
            },              
            {
                path: '',
                redirectTo: '/',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PublicAccessRoutingModule {}
