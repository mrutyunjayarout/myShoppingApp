import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements CanActivate {
    URL="https://fakestoreapi.com/products";
    
    shoppingCount =0;
    totalProductList =new BehaviorSubject<any>("");
    addtoCartList =[];

    shopping = new BehaviorSubject<number>(this.shoppingCount);
    openCommonMsg = new BehaviorSubject<string>("");
    toggleSpinner = new Subject();
    private isloggedIn: boolean = false;

  constructor(private _http:HttpClient) { }


  getAllProduct():Observable<any>{  

return this._http.get(this.URL);
  }

  getProduct(id):Observable<any>{
    return this._http.get(this.URL+"/"+id);
  }
  

  getAllCategories(){
    return this._http.get("https://fakestoreapi.com/products/categories");
  }

  saveProduct(data){
    return this._http.post("https://fakestoreapi.com/products",data);
  }
  updateProduct(id,data){
    return this._http.put("https://fakestoreapi.com/products/"+id,data);
  }
  deleteProduct(id){
    return this._http.delete("https://fakestoreapi.com/products/"+id);
  }
  authenticateUser(data){
    console.log(">>>>"+JSON.stringify(data));
    return this._http.post('https://fakestoreapi.com/auth/login',data);
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    !this.isloggedIn?this.openCommonMsg.next('user is not authenticated to view this page'):''; 
    return this.isloggedIn;
  }
  logoutUser(): void {
    this.isloggedIn = false;
}
activateLoggedInUser(){
    this.isloggedIn = true;
}
}
