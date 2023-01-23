import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ChekoutListComponent } from "./chekout-list/chekout-list.component";
import { CanDeactivateGuard } from "./chekout-list/can-deactivate-guard.service";
import { ProductMgmtComponent } from "./product-mgmt/product-mgmt.component";
import { ProductService} from './product.service'

const routes: Routes = [{ path: 'home', component: ProductListComponent},
{ path: 'product/:id', component: ProductDetailsComponent },
{ path: 'checkout', component: ChekoutListComponent,canDeactivate: [CanDeactivateGuard] },
{ path: 'productMgmt', component: ProductMgmtComponent,canActivate:[ProductService]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
