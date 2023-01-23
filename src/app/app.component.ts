import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from './product.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    toggleDropDownSearch = false;
    productList = [];
    filteredSearchList = [];
    userSearchUpdate = new Subject<string>();
    userInput = "";
    selectedProductObj;
    shoppingCount;
    userName="Account";
    loggedStatus=false;
    message="";
    $commonModal;
    showSpinner=false;
    $spinner;

    @ViewChild('msgContent')
    private msgContent = {} as TemplateRef<any>;
    loginForm = new FormGroup({
        'username':new FormControl('mor_2314'),
        'password':new FormControl('83r5^_'),
    });
    $msgObservable;

    constructor(private modalService: NgbModal, private productService: ProductService, private router: Router) {
        this.$commonModal = this.productService.openCommonMsg;
        this.$spinner = this.productService.toggleSpinner;

        this.$commonModal.subscribe((data)=>{
               if(data!=''){
                const modalRef  = this.modalService.open(this.msgContent);
                      this.message = data;
               }
        });
        this.$spinner.subscribe((data)=>{
            data?this.showSpinner=true:this.showSpinner=false;
        })

     }

    open(content) {
        if(!this.loggedStatus){
            this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
                (result) => {
    
                },
                (reason) => {
    
                },
            );
        }else{
            this.resetLoggedOutUserData();
            this.$commonModal.next('user has successfully logged out');
        }
        
    }

    ngOnInit() {
        this.$spinner.next(true);
        this.userSearchUpdate.pipe(
            debounceTime(400),
            distinctUntilChanged())
            .subscribe(value => {
                this.getFilterProductName(value);
            });
        this.productService.getAllProduct().subscribe((resp) => {
            this.productList = resp;
            this.filteredSearchList = [...resp];
            this.productService.totalProductList.next(this.productList);
            this.router.navigate(['home'])
        },()=>{},()=>{
            this.$spinner.next(false);
        });
        this.productService.shopping.subscribe(num=>{
            this.shoppingCount = num;
        });
    }
    getFilterProductName(val) {
        if (this.productList.length > 0) {
            this.filteredSearchList = this.productList.filter((product) => {
                return (product.title.toLowerCase().indexOf(val.toLowerCase()) != -1)
            });

            if (val == "") {
                this.toggleDropDownSearch = false;
            } else {
                this.filteredSearchList.length > 0 ? this.toggleDropDownSearch = true : this.toggleDropDownSearch = false;
            }


        }
    }
    setSerachField(obj) {
        this.userInput = obj.title;
        this.toggleDropDownSearch = false;
        this.selectedProductObj = obj;
    }
    searchData() {

        this.router.navigate(['/product', this.selectedProductObj.id]);
    }

    submitLoginForm(){
        this.$spinner.next(true);
      this.productService.authenticateUser(this.loginForm.value).subscribe((resp:any)=>{
         if(resp && resp?.token){
            this.modalService.dismissAll();    
            this.userName=this.loginForm.get('username').value;
            this.loggedStatus = true;
            this.$commonModal.next('user has succesfully authenticated');
            this.productService.activateLoggedInUser();
            
         }
        
      },(error)=>{
        this.modalService.dismissAll();
         console.log(">>>>"+JSON.stringify(error.error));
         this.$spinner.next(false);
        this.$commonModal.next(error.error);
      },()=>{
        this.$spinner.next(false);
      })   
    }
    onClosePopUp(){
        this.modalService.dismissAll();
    }

    resetLoggedOutUserData(){
        this.router.navigate(["/home"]);
        this.loggedStatus=false;
        this.userName="Account";
        this.productService.logoutUser();
    }

}
