import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
  }

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor() { }
  canDeactivate(component, 
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot) {

let url: string = state.url;
console.log('Url: '+ url);

const confirmation = window.confirm('Are you sure want to leave this page?');

return of(confirmation);


}
}
