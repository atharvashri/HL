import { Component, OnInit } from '@angular/core';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { BuiltyService } from '../../services/builty.service';
import { WindowRef } from '../../utils/window.ref';
import { AppConfig } from '../../app-config';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  styleUrls: ['./payment-instruction.component.css']
})
export class PaymentInstructionComponent implements OnInit {

private gridApi: any;
  constructor(private builtyService: BuiltyService,
        private toaster: ToastrService,
        private windowRef: WindowRef,
        private spinner: NgxSpinnerService) { }

  columnDefs = [
        {field: 'checkRow', checkboxSelection: true, headerCheckboxSelection:true, width: 40 },
        {headerName: 'Builty No', field: 'builtyNo', width: 120 },
        {headerName: 'Received Date', field: 'receivedDate', width: 140},
        {headerName: 'Received Quantity', field: 'receivedQuantity', width: 140},
        {headerName: 'Vehicle No.', field: 'vehicleNo', width: 120},
        {headerName: 'Owner', field: 'vehicleOwner', width: 180},
        {headerName: 'Freight', field: 'freightBill', width: 120},
        {headerName: 'Bank Details Available YES/NO', field: 'bankDtlsAvailable', width: 180, cellRenderer: 'customCellRenderer'}
    ];

    defaultColDef: {
      width: 100
    }

    rowData: Array<any> = [];

  ngOnInit() {
    this.spinner.show();
    this.builtyService.getForPendingPayments().subscribe(
      (res) => {
        this.spinner.hide();
        if(res.success){
          this.rowData = res.data;
          this.toaster.success(res.message);
        }else{
          this.toaster.error("Some internal error ocurred while retrieving builties for payments: " + res.message);
        }
      },
      () => {
          this.spinner.hide();
          this.toaster.error("Error in retrieving builties for payments");
      }
    )
  }

  isRowSelectable(rowNode){
    return rowNode.data ? rowNode.data.bankDtlsAvailable : false;
  }

  rowClassRules = {
    'disabled-row': '!data.bankDtlsAvailable'
  }

  onGridReady(param){
    this.gridApi = param.api;
  }
  generateInstructions(){
    let rows = this.gridApi.getSelectedRows();
    this.spinner.show();
    this.builtyService.exportInstructions(rows).subscribe(
      (res) => {
        this.spinner.hide();
        if(res.success){
          this.windowRef.nativeWindow.open(AppConfig.API_ENDPOINT + "/builty/payment/downloadInstruction?key=" + res.data, '_blank');
        }
        this.toaster.success("Payment instructions generated successfully");
      },
      () => {
        this.spinner.hide();
        this.toaster.error("Error while generating instruction");
      }
    )
  }
  customCellRenderer(param){
    return param.value ? "YES" : "NO";
  }

}
