import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CalculationsComponent } from './pages/calculations/calculations.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PricingPoliciesComponent } from './pages/pricing-policies/pricing-policies.component';
import { ProductsComponent } from './pages/products/products.component';
import { LayoutComponent } from './layout/layout.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { NormativesComponent } from './pages/normatives/normatives.component';
import { ImportProductsComponent } from './pages/import-products/import-products.component';
import { UsersComponent } from './pages/users/users.component';
import { WhatIfComponent } from './pages/what-if/what-if.component';
import { PriceApprovalComponent } from './pages/price-approval/price-approval.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [ 
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'normatives', component: NormativesComponent, canActivate: [roleGuard([UserRole.ECONOMIST, UserRole.ADMIN])] },
      { path: 'categories', component: CategoriesComponent, canActivate: [roleGuard([UserRole.ECONOMIST, UserRole.ADMIN])] },
      { path: 'import-products', component: ImportProductsComponent, canActivate: [roleGuard([UserRole.ACCOUNTANT, UserRole.ADMIN])] },
      { path: 'price-approval', component: PriceApprovalComponent, canActivate: [roleGuard([UserRole.ACCOUNTANT, UserRole.MANAGER, UserRole.ADMIN])] },
      { path: 'calculations', component: CalculationsComponent, canActivate: [roleGuard([UserRole.ACCOUNTANT, UserRole.ADMIN])] },
      { path: 'statistics', component: StatisticsComponent, canActivate: [roleGuard([UserRole.ECONOMIST, UserRole.MANAGER, UserRole.ADMIN])] },
      { path: 'what-if', component: WhatIfComponent, canActivate: [roleGuard([UserRole.ECONOMIST, UserRole.ADMIN])] },
      { path: 'users', component: UsersComponent, canActivate: [roleGuard([UserRole.ADMIN])] },
      { path: 'pricing-policies', component: PricingPoliciesComponent },
    ]
  },
];
