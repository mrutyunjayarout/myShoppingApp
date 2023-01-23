import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
    categoryList;
    formSubmitted=false;
    productForm = new FormGroup({
        title:new FormControl('',[Validators.required,Validators.minLength(3), Validators.maxLength(50)]),
        description:new FormControl('',[Validators.required,Validators.minLength(3)]),
        category:new FormControl('',[Validators.required]),
        price:new FormControl('',[Validators.required])

    });
    @Output()
     closeModalWindow = new EventEmitter();

     @Input()
     productObj;
     $commonModal;
     $spinner

  constructor(private productService: ProductService) { 
    this.$commonModal = this.productService.openCommonMsg;
    this.$spinner = this.productService.toggleSpinner;
  }

  ngOnInit(): void {
    this.productService.getAllCategories().subscribe(resp=>{
        this.categoryList = resp;
    })
  }
  ngOnChanges(){
    console.log("this.productObj>>>>"+JSON.stringify(this.productObj));
    if(this.productObj){
        this.productForm.get('title').setValue(this.productObj.title);
        this.productForm.get('description').setValue(this.productObj.description);
        this.productForm.get('category').setValue(this.productObj.category);
        this.productForm.get('price').setValue(this.productObj.price);
    }
    
  }
    
  saveForm(){
    this.formSubmitted=true;
console.log("this.productForm.valid>>>>"+this.productForm.valid);
    if(this.productForm.valid){
        this.$spinner.next(true);
        if(!this.productObj){
            
            this.productService.saveProduct(this.productForm.value).subscribe((data)=>{
                this.$spinner.next(false);
                this.$commonModal.next('Data saved successfully');
                this.closeModalWindow.emit({"data":data,"type":'save'});        
              });
        }else{
            
            this.productService.updateProduct(this.productObj.id,this.productForm.value).subscribe((data)=>{
                this.$commonModal.next('Data updated successfully');
                this.$spinner.next(false);
                this.closeModalWindow.emit({"data":data,"type":'update'});        
              });
        }
      
    }
  }

  closePopUp(){
    this.closeModalWindow.emit('');        
  }

}
