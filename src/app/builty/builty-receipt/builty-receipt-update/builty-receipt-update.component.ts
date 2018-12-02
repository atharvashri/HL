import { Component, OnInit, Input } from '@angular/core';
import { BuiltyService } from '../../../services/builty.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { FormBuilder, Validators, FormArray } from '../../../../../node_modules/@angular/forms';
import { AppUtil } from '../../../utils/app.util';

@Component({
  selector: 'app-builty-receipt-update',
  templateUrl: './builty-receipt-update.component.html',
//   styleUrls: ['./builty-receipt.component.css']
})
export class BuiltyReceiptUpdateComponent implements OnInit {

  constructor(private builtyService: BuiltyService, private router: Router,
      private toaster: ToastrService, private _fb: FormBuilder) { }

  @Input() builtyList;
  @Input() builtyListProperties;
  receiptForm;
  ngOnInit() {
    this.receiptForm = this._fb.group({
      builtyitems: this._fb.array([])
    })
    this.setBuiltyItems();
  }

  setBuiltyItems(){
    let _control = <FormArray>this.receiptForm.controls.builtyitems;
    this.builtyList.forEach(item => {
      let _fg = this._fb.group({
        id: [<string>item.id],
        builtyNo: [{value: <string>item.builtyNo, disabled: true}],
        receivedDate: [AppUtil.currentdate(), Validators.required],
        receivedQuantity: [<number>item.receivedQuantity, Validators.required]
      });
      _control.push(_fg);
    });
  }

  updateReceipt(){
    if(this.receiptForm.invalid){
      this.toaster.error("Received Date and Received Quantity is required for all builty");
      return;
    }

    this.builtyService.builtyReceipt(this.convertToBuiltyDTO()).subscribe(
      (res) => {
        if(res.success){
          this.toaster.success(res.message);
          this.builtyService.setActiveBuilties([]);
          this.router.navigate(['builtylist']);
        }else{
          this.toaster.error(res.message);
        }
      },
      (error) => {
        this.toaster.error("Internal Server error");
      }
    );
  }

  convertToBuiltyDTO(){
    let _builtyDTOs = [];

    let _formval = this.receiptForm.value;
    _formval.builtyitems.forEach(item => {
      let tmp = {
        id: item.id,
        receivedDate: AppUtil.transformdate(item.receivedDate),
        receivedQuantity: item.receivedQuantity
      }
      _builtyDTOs.push(tmp);
    })
    return _builtyDTOs;
  }
}
