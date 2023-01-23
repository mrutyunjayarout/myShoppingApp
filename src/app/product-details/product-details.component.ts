import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'; 
import { switchMap } from 'rxjs/operators';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productDetails;
  num=0;
  constructor(private route: ActivatedRoute,private productService :ProductService) { }



  ngOnInit(): void {
    
    this.route.params.pipe(
        switchMap((params: Params) => this.productService.getProduct(+params['id']))
      ).subscribe(resp =>{ 
        this.productDetails = resp;
        this.num=0;
    },()=>{},()=>{
        
    }); 
  }
  increase(){
    this.num++;
    
  }
  decrease(){
    this.num--;
    
  }
  addProductToCart(){
    

    if(this.num==0){
        this.productService.addtoCartList.push({'data':this.productDetails,'count':this.num});
        this.increase();
    }else{
        this.productService.addtoCartList.forEach((product)=>{
            if(product.data.id==this.productDetails.id){
                product.count= ++this.num;
            }
        })
    }
    //this.productService.addtoCartList.push({'data':this.productDetails,'count':this.num});
    this.productService.shopping.next(this.productService.addtoCartList.length);
  }

}
