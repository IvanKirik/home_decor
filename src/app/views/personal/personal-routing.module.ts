import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FavoriteComponent} from "./favorite/favorite.component";
import {InfoComponent} from "./info/info.component";
import {OrdersComponent} from "./orders/orders.component";


const routes: Routes = [
  {path: 'favorite', component: FavoriteComponent},
  {path: 'profile', component: InfoComponent},
  {path: 'orders', component: OrdersComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
