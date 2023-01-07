import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isShowed$ = new Subject<boolean>();

  constructor() { }

  public show(): void {
    this.isShowed$.next(true);
  }

  public hide(): void {
    this.isShowed$.next(false);
  }
}
