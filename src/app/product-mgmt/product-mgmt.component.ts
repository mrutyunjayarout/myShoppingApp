import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-mgmt',
  templateUrl: './product-mgmt.component.html',
  styleUrls: ['./product-mgmt.component.css']
})
export class ProductMgmtComponent implements OnInit {
    productList=[];
    filteredSearchList=[];
	page = 1;
	pageSize = 10;
	collectionSize = 0;
    selectedProduct;

    @ViewChild('content')
    private content = {} as TemplateRef<any>;
    $commonModal: any;
    $spinner: any;
    

  constructor(private productService: ProductService,private modalService: NgbModal) { 
    this.$commonModal = this.productService.openCommonMsg;
    this.$spinner = this.productService.toggleSpinner;
  }

  ngOnInit(): void {
    
    this.productService.getAllProduct().subscribe((resp) => {
        this.productList = resp;
        this.filteredSearchList = [...resp];
        this.collectionSize = this.productList.length;
        this.refreshCountries();
    },()=>{
        this.$spinner.next(false)
    },()=>{
        this.$spinner.next(false)
    });
  };
  ngAfterViewInit(){
    
  }
  open(content) {
    this.selectedProduct=undefined;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
          
        },
        (reason) => {
          
        },
    );
}
  refreshCountries() {
    this.collectionSize = this.productList.length;
    this.filteredSearchList = this.productList.map((obj, i) => ({ id: i + 1, ...obj })).slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize,
    );
}
onSelectRow(value){

}

closePopUp(data){
    //console.log(">>>>"+JSON.stringify(data));
    if(data.type==='save'){
        this.productList.push(data);
    }else if(data.type==='update'){
        this.productList = this.productList.filter((product)=>{
                return product.id != data['data'].id;
        });
    }
    
    
    this.refreshCountries();
    this.modalService.dismissAll();
}
updateProduct(product){
this.selectedProduct=product;
this.modalService.open(this.content);
}
deleteProduct(product){
    this.productService.deleteProduct(product.id).subscribe((data)=>{
        this.$commonModal.next('Data deleted successfully');
        this.productList = this.productList.filter((obj)=>{
            return product.id != obj.id;
    });
    })
    this.refreshCountries();

}

}
