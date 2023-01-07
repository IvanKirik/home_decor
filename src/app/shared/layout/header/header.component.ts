import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
import {FavoriteService} from "../../services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public searchField = new FormControl();
  public showedSearch: boolean = false;
  public products: ProductType[] = [];
  public count: number = 0;
  public countFavorites: number = 0;
  public isLogged: boolean = false;
  public serverStaticPath = environment.serverStaticPass;
  @Input() categories: CategoryWithTypeType[] = [];

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private cartService: CartService,
              private productService: ProductService,
              private favoriteService: FavoriteService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  public ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
            })
        } else {
          this.products = [];
        }
      })

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    })

    this.cartService.getCartCount()
      .subscribe((data: {count: number} | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.count = (data as {count: number}).count;
      });

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      })

    this.favoriteService.count$
      .subscribe(count => {
        this.countFavorites = count;
      })

    if (this.authService.getIsLoggedIn()) {
      this.favoriteService.getFavorites()
        .subscribe((data: FavoriteType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          this.countFavorites = (data as FavoriteType[]).length;
        });
    }
  }

  public logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  // public changeSearchValue(newValue: string): void {
  //   this.searchValue = newValue;
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProducts(this.searchValue)
  //       .subscribe((data: ProductType[]) => {
  //         this.products = data;
  //       })
  //   } else {
  //     this.products = [];
  //   }
  // }

  public selectProduct(url: string): void {
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue('');
    this.products = [];
  }

  public changeShowedSearch(value: boolean): void {
    setTimeout(() => {
      this.showedSearch = value;
    }, 500)
  }
}
