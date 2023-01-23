import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

   totalProductList=[]; 

  constructor( private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.totalProductList.subscribe((data)=>{
    this.totalProductList=data;
    })
  }
  addToCart(product){
    this.router.navigate(['/product', product.id]);
  }

}
