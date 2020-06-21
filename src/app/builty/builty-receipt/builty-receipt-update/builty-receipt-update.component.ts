import { Component, OnInit, Input} from '@angular/core';
import { BuiltyService } from '../../../services/builty.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { AppUtil } from '../../../utils/app.util';
import { DoService } from '../../../services/do.service';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../app/app-config';

@Component({
  selector: 'app-builty-receipt-update',
  templateUrl: './builty-receipt-update.component.html',
  //styleUrls: ['./builty-receipt-update.component.css']
})
export class BuiltyReceiptUpdateComponent implements OnInit{

  constructor(private builtyService: BuiltyService,
      private doService: DoService,
      private toaster: ToastrService,
      private _fb: FormBuilder) { }

  @Input() builtyList;
  receiptForm;
  shortageLimits: Array<Array<any>> = [];
  deductionRates: Array<Array<any>> = [];
  commissions: Array<Array<any>> = [];
  eligibleForUpdate: Array<boolean> = [];
  rowData: Array<any> = [];
  extraReceivedQuantityLimit = AppConfig.EXTRA_RECEIVED_QUANTITY_LIMIT;

  ngOnInit() {
    this.receiptForm = this._fb.group({
      builtyitems: this._fb.array([])
    })
    this.setBuiltyItems();
  }

  async setBuiltyItems(){
    let _control = <FormArray>this.receiptForm.controls.builtyitems;
    let _doFetchInProgress = [];
    let _awaitingPromise = [];

    this.builtyList.forEach((item, index) => {
      this.eligibleForUpdate[index] = true;
      let _fg = this._fb.group({
        id: [<string>item.id],
        biltyNo: [<string>item.biltyNo],
        vehicleNo: [<string>item.vehicleNo],
        quantity: [<string>item.netWeight],
        receivedDate: [item.receivedDate ? item.receivedDate : AppUtil.currentdate(), Validators.required],
        receivedQuantity: [<number>item.receivedQuantity, Validators.required],
        allowedShortage: [],
        deductionRate: [],
        commission: [],
        totalAdvance: [<number>item.totalAdvance],
        freightRate: [<number>item.freight], // freight rate
        freightBill: [item.freightBill ? <number>item.freightBill : '-']
      });
      _control.push(_fg);
      let _isHttpRequest = false;
      let _promise = new Promise((resolve, reject) => {
        if(_doFetchInProgress.indexOf(item.doId) < 0){
          let _return = this.doService.getDoByID(item.doId);
          if(_return instanceof Observable){
            _isHttpRequest = true;
            _return.subscribe(
              (res) => {
                if(res.success){
                  this.doService.cachedDO.set(item.doId, res.data)
                }
                resolve("done");
              },
              (err) => {
                reject("Couldn't get DO details: " + err);
              }
            )
          }
        }
      })
      if(_isHttpRequest){
        _awaitingPromise.push(_promise);
      }
      _doFetchInProgress.push(item.doId);
    });
    //while(_activeRequestCounter > 0);   //do nothiong just wait for all request to complete
    _doFetchInProgress = []; // reset
    try{
      await Promise.all(_awaitingPromise); // await for all http request to be resolved
    }catch(err){
      console.log(err);
    }

    this.builtyList.forEach((item, index) => {
      let _return = this.doService.getDoByID(item.doId); //by this time all DO should come from client side cache
      this.populateDropDownData(_return, index)
    });
    this.setDefaultValues();
  }

  validateConditionalFields(){
    return (group : FormGroup) => {
      let _receiveQuantity = group.controls['receivedQuantity'].value;
      if(_receiveQuantity){
        let _netWeight = group.controls['quantity'].value;
        // received quantity should not be much beyond net weight
        if(_receiveQuantity - _netWeight > AppConfig.EXTRA_RECEIVED_QUANTITY_LIMIT){
            alert()
        }
      }
    }
  }

  populateDropDownData(doData: any, idx: number){
    if(doData.shortageLimit.length && doData.commission.length && doData.deductionRate.length){
      this.shortageLimits[idx] =  doData.shortageLimit
      this.commissions[idx] = doData.commission
      this.deductionRates[idx] = doData.deductionRate
    }else{
      this.eligibleForUpdate[idx] = false
    }
  }

  setDefaultValues(){
    let _control = <FormArray>this.receiptForm.controls.builtyitems;

    _control.controls.forEach((group, index) => {
      let _shortageLimit = this.shortageLimits[index] && this.shortageLimits[index].length ? this.shortageLimits[index][0] : undefined
      let _deductionRate = this.deductionRates[index] && this.deductionRates[index].length ? this.deductionRates[index][0] : undefined
      let _commission = this.commissions[index] && this.commissions[index].length ? this.commissions[index][0] : undefined
      group['controls'].allowedShortage.setValue(_shortageLimit);
      group['controls'].deductionRate.setValue(_deductionRate);
      group['controls'].commission.setValue(_commission);
    })
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
      if(this.eligibleForUpdate[idx]){
        let tmp = {
          biltyNo: item.biltyNo,
          receivedDate: item.receivedDate,
          receivedQuantity: item.receivedQuantity,
          freightBill: this.calculateFreightBill(item),
          deductionRate: item.deductionRate,
          commission: item.commission,
          shortageLimit: item.allowedShortage,
          tdsAmount: item.tdsAmount
        }
        if(tmp.freightBill){
          this.receiptForm.controls.builtyitems.controls[idx].controls.freightBill.setValue(tmp.freightBill);
          _builtyDTOs.push(tmp);
        }
      }
    }, this)
    return _builtyDTOs;
  }

  calculateFreightBill(builty){
    let _freight: number;
    this.builtyList.some(item => {
      if(item.id == builty.id){
        _freight = item.netWeight * item.freight;

        //apply tds rate
        if(item.tdsApplicable){
          let _do = this.doService.getDoByID(item.doId);
          if(_do && _do.tdsRate){
            builty.tdsAmount = (_freight * (_do.tdsRate/100))
            _freight = _freight - builty.tdsAmount
          }else{
            _freight = 0
            alert(`TDS is applicable for bilty ${item.biltyNo} but tds rate not defined in DO. This bilty will not be updated`);
            return true;
          }
        }
        // if received quantity is not within allowed shortage, not ok apply deduction rate on difference
        // allowed shortage is devided by 1000 because it is in kg and all other quantities are in mtonne
        if((item.netWeight - builty.receivedQuantity) > (builty.allowedShortage/1000)){
          _freight = _freight - ((item.netWeight - builty.receivedQuantity) * 1000 * builty.deductionRate) - builty.commission - item.totalAdvance
        }else{ //received quantity is within allowed shortage, ok and don't apply deduction rate
          _freight = _freight - builty.commission - item.totalAdvance
        }
        // apply other deduction
        if(item.otherDeduction){
          _freight = _freight - item.otherDeduction;
        }
        // deduct refund
        if(item.refund){
          _freight = _freight - item.refund
        }
        return true;
      }
    })
    return Math.ceil(_freight);
  }
}
