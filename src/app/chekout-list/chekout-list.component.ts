import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationStart, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-chekout-list',
    templateUrl: './chekout-list.component.html',
    styleUrls: ['./chekout-list.component.css']
})
export class ChekoutListComponent implements OnInit {

    checkoutProductDetails = [];
    toggleCheckout = false;
    subTotal = 0;
    tax = 5;
    constructor(private productService: ProductService, private modalService: NgbModal, private router: Router) { }

    ngOnInit(): void {
        this.checkoutProductDetails = this.productService.addtoCartList;
        this.calculateTotalPrice();
        this.showHideChekout();

    }

    open(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            (result) => {
                console.log(">>>a>>>");
            },
            (reason) => {
                console.log(">>>b>>>");
            },
        );
    }
    closeModalwindow() {
        this.modalService.dismissAll();
        this.router.navigate(["/home"]);
        this.productService.addtoCartList = [];
        this.productService.shopping.next(this.productService.addtoCartList.length);

    }
    removeItems(obj) {

        this.productService.addtoCartList = this.productService.addtoCartList.filter((value) => {
            return value.data.id != obj.id;
        });
        this.checkoutProductDetails = this.productService.addtoCartList;
        this.showHideChekout();


        this.productService.shopping.next(this.productService.addtoCartList.length);
        this.calculateTotalPrice();
    }
    showHideChekout() {
        if (this.checkoutProductDetails.length > 0) {
            this.toggleCheckout = true;
        } else {
            this.toggleCheckout = false;
        }
    }
    calculateTotalPrice() {
        this.subTotal = 0;
        this.checkoutProductDetails.forEach((value) => {
            this.subTotal = this.subTotal + (value.data.price * value.count);
        });

    }

    
}
