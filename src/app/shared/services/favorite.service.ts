import {Injectable} from '@angular/core';
import {Observable, Subject, tap} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FavoriteType} from "../../../types/favorite.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private count: number = 0;
  public count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) {
  }

  public setCount(count: number) {
    this.count = count;
    this.count$.next(this.count)
  }

  public getFavorites(): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites')
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error')) {
            this.setCount((data as FavoriteType[]).length)
          }
        })
      )
  }

  public removeFavorite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {body: {productId}})
      .pipe(
        tap(data => {
          if (!data.error) {
            this.setCount(this.count - 1);
          }
        })
      )
  }

  public addFavorite(productId: string): Observable<FavoriteType | DefaultResponseType> {
    return this.http.post<FavoriteType | DefaultResponseType>(environment.api + 'favorites', {productId})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error')) {
            this.setCount(this.count + 1);
          }
        })
      )
  }
}
