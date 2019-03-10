import { Component, OnInit, Input } from '@angular/core';
import { BuiltyService } from '../../../services/builty.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { FormBuilder, Validators, FormArray } from '../../../../../node_modules/@angular/forms';
import { AppUtil } from '../../../utils/app.util';
import { Refdata } from '../../../utils/refdata.service';

@Component({
  selector: 'app-builty-receipt-update',
  templateUrl: './builty-receipt-update.component.html',
//   styleUrls: ['./builty-receipt.component.css']
})
export class BuiltyReceiptUpdateComponent implements OnInit {

  constructor(private builtyService: BuiltyService, private router: Router,
      private toaster: ToastrService, private _fb: FormBuilder, private refService: Refdata) { }

  @Input() builtyList;
  receiptForm;
  shortageLimits: Array<any> = [];
  deductionRates: Array<any> = [];
  commissions: Array<any> = [];

  // columnDefs = [
  //       {headerName: 'Builty No', field: 'builtyNo' },
  //       {headerName: 'Received Date', field: 'receivedDate' },
  //       {headerName: 'Received Quantity', field: 'receivedQuantity'}
  //   ];

    rowData: Array<any> = [];
  ngOnInit() {
    this.receiptForm = this._fb.group({
      builtyitems: this._fb.array([])
    })
    this.refService.getRefData().subscribe(
      (res) => {
        let freightData = res['data']['freightData'];
        if(freightData){
          this.shortageLimits = freightData['shortageLimit'];
          this.deductionRates = freightData['deductionRate'];
          this.commissions = freightData['commission'];
          this.setDefaultValues();
        }
      }
    )
    this.setBuiltyItems();

  }

  setBuiltyItems(){
    let _control = <FormArray>this.receiptForm.controls.builtyitems;
    this.builtyList.forEach(item => {
      let _fg = this._fb.group({
        id: [<string>item.id],
        builtyNo: [<string>item.builtyNo],
        vehicleNo: [<string>item.vehicleNo],
        quantity: [<string>item.netWeight],
        receivedDate: [item.receivedDate ? AppUtil.transformdate(item.receivedDate) : AppUtil.currentdate(), Validators.required],
        receivedQuantity: [<number>item.receivedQuantity, Validators.required],
        allowedShortage: [],
        deductionRate: [],
        commission: [],
        totalAdvance: [<number>item.totalAdvance],
        freightRate: [<number>item.freight], // freight rate
        freightBill: [item.freightBill ? <number>item.freightBill : '-']
      });
      _control.push(_fg);
    });
  }

  setDefaultValues(){
    let _control = <FormArray>this.receiptForm.controls.builtyitems;
    let shortageLimitDefault = this.findDefault(this.shortageLimits);
    let deductionRateDefault = this.findDefault(this.deductionRates);
    let commissionDefault = this.findDefault(this.commissions);

    _control.controls.forEach(group => {
      group.controls.allowedShortage.setValue(shortageLimitDefault);
      group.controls.deductionRate.setValue(deductionRateDefault);
      group.controls.commission.setValue(commissionDefault);
    })
  }

  findDefault(inputArr){
    let defaultVal;
    if(inputArr){
      inputArr.some(item => {
        if(item.defaultValue){
          defaultVal = item.value;
          return true;
        }
      })
    }
    return defaultVal;
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
          // this.builtyService.setActiveBuilties([]);
          // this.router.navigate(['builtylist']);

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
    _formval.builtyitems.forEach(function(item, idx) {
      let tmp = {
        id: item.id,
        receivedDate: AppUtil.transformdate(item.receivedDate),
        receivedQuantity: item.receivedQuantity,
        freightBill: this.calculateFreightBill(item)
      }
      this.receiptForm.controls.builtyitems.controls[idx].controls.freight.setValue(tmp.freightBill);
      _builtyDTOs.push(tmp);
    }, this)
    return _builtyDTOs;
  }

  calculateFreightBill(builty){
    let finalBill;
    this.builtyList.some(item => {
      if(item.id == builty.id){
        let quantity = item.netWeight;
        // if received quantity is not within allowed shortage, not ok apply deduction rate on difference
        // allowed shortage is devided by 1000 because it is in kg and all other quantities are in mtonne
        if((quantity - builty.receivedQuantity) > (builty.allowedShortage/1000)){
          finalBill = (item.freight * quantity) - ((quantity - builty.receivedQuantity) * 1000 * builty.deductionRate) - builty.commission - item.totalAdvance
        }else{ //received quantity is within allowed shortage, ok and don't apply deduction rate
          finalBill = (item.freight * quantity) - builty.commission - item.totalAdvance
        }
        return true;
      }
    })
    return Math.ceil(finalBill);
  }
}
