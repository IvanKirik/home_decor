import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  public products: FavoriteType[] = [];
  public cart: CartType | null = null;
  public serverStaticPath = environment.serverStaticPass;
  public count: number = 1;
  @Input() countInCart: number | undefined = 0;


  constructor(private favoriteServices: FavoriteService,
              private cartService: CartService) {
  }

  public ngOnInit(): void {
    this.favoriteServices.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.products = data as FavoriteType[];

      });

    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        this.cart = (data as CartType);
          if(this.cart.items.length > 0) {
            this.cart.items.forEach(cartItem => {
              this.products.forEach(favoriteItem => {
                if (cartItem.product.id === favoriteItem.id) {
                  favoriteItem.isInCart = true;
                }
                if (cartItem.product.id === favoriteItem.id) {
                  favoriteItem.quantity = cartItem.quantity;
                }
              })
            })
          }
      })
  }

  public removeFromFavorites(id: string) {
    this.favoriteServices.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }

  public updateCart(productId: string, count: number): void {
    this.cartService.updateCart(productId, count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;
        this.products.forEach(item => {
          if (item.id === productId && count !== 0) {
            item.isInCart = true;
          } else if (item.id === productId && count === 0) {
            item.isInCart = false;
            item.quantity = 1;
          }
        })
      });
  }

  public updateCount(id: string, count: number): void {
    if(this.cart) {
      this.cartService.updateCart(id, count)
        .subscribe((data:  CartType | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.cart = data as CartType;
        })
    }
  }
}
