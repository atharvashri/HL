import { Component, OnInit } from '@angular/core';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { BuiltyService } from '../../services/builty.service';
import { WindowRef } from '../../utils/window.ref';
import { AppConfig } from '../../app-config';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularGridInstance, Column, GridOption, FieldType, Formatters, Aggregators, Grouping, GroupTotalFormatters } from 'angular-slickgrid';
import { CustomFormatters } from '../../utils/custom-slickgrid.formatters';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  styleUrls: ['./payment-instruction.component.css']
})
export class PaymentInstructionComponent implements OnInit {

angularGrid: AngularGridInstance;
gridObj: any;
allColumns: Column[];
gridOptions: GridOption;
rowData: Array<any> = [];
instructionSubmitted: boolean = false;

  constructor(private builtyService: BuiltyService,
        private toaster: ToastrService,
        private windowRef: WindowRef,
        private spinner: NgxSpinnerService) { }

  columnDefs: Column[] = [
        {id:'panNo', field: 'panNo', name: 'PAN', maxWidth: 120, type: FieldType.string, formatter: this.emptyStringFormatter, groupTotalsFormatter: GroupTotalFormatters.avgTotals, params: { groupFormatterPrefix: '<b>Extra Payment</b>: ', groupFormatterSuffix: ' <i>* it would be deducted from total freight</i>'} },
        {id:'builtyNo', field: 'builtyNo', name: 'Builty No', maxWidth: 120, type: FieldType.string },
        {id:'receivedDate', field: 'receivedDate', name: 'Received Date', maxWidth: 120, type: FieldType.dateIso, formatter: CustomFormatters.dateFormatter },
        {id:'receivedQuantity', field: 'receivedQuantity', name: 'Received Quantity', maxWidth: 100, type: FieldType.number },
        {id:'vehicleNo', field: 'vehicleNo', name: 'Vehicle No', maxWidth: 120, type: FieldType.string },
        {id:'vehicleOwner', field: 'vehicleOwner', name: 'Owner', maxWidth: 150, type: FieldType.string },
        {id:'freightBill', field: 'freightBill', name: 'Freight', maxWidth: 120, type: FieldType.number, groupTotalsFormatter: GroupTotalFormatters.sumTotals, params: { groupFormatterPrefix: '<b>Total</b>: ' /*, groupFormatterSuffix: ' USD'*/ } },
        {id:'bankDtlsAvailable', field: 'bankDtlsAvailable', name: 'Bank Details Available', maxWidth: 100, type: FieldType.string, formatter: Formatters.yesNo }
    ];

  ngOnInit() {
    this.spinner.show();
    this.builtyService.getReadyForPayments().subscribe(
      (res) => {
        this.spinner.hide();
        if(res.success){
          this.rowData = res.data;
          this.toaster.success(res.message);
          if(this.rowData.length){
            $('#pending-payment-container .btn-primary').prop("disabled", false);
          }else{
            $('.grid-canvas').html('<div>No Data is available for payment instruction</div>');
          }

          //this.gridObj.invalidateAllRows();
          //
          //$('.grid-canvas').html('<div>No Data is available for payment instruction</div>');

        }else{
          this.toaster.error("Some internal error ocurred while retrieving builties for payments: " + res.message);
        }
      },
      () => {
          this.spinner.hide();
          this.toaster.error("Error in retrieving builties for payments");
      }
    )

    this.gridOptions = {

      enableColumnReorder: false,
      enableAutoResize: true,
      //enableAsyncPostRender: true,
      enableGridMenu: false,
      enableColumnPicker: false,
      defaultColumnWidth: 100,
      enableAutoTooltip: true,
      autoResize: {
        containerId: 'pending-payment-container'
      },
      enableGrouping: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      checkboxSelector: {
        // you can toggle these 2 properties to show the "select all" checkbox in different location
        hideInFilterHeaderRow: false
      },
      rowSelectionOptions:{
        selectActiveRow: false
      },
      minRowBuffer: 1

    }
  }

  isRowSelectable(rowNode){
    return rowNode.data ? rowNode.data.bankDtlsAvailable : false;
  }

  rowClassRules = {
    'disabled-row': '!data.bankDtlsAvailable'
  }

  onGridReady(e){
      this.angularGrid = e;
      this.gridObj = this.angularGrid && this.angularGrid.slickGrid || {}
      //this.gridObj.setSelectionModel(new Slick.CheckboxSelectColumn())
      this.groupByPan()
  }

  generateInstructions(){
    let selectedIdx: number[] = this.gridObj.getSelectedRows()
    let rows: any[] = [];
    selectedIdx.forEach(idx => {
      let item = this.gridObj.getDataItem(idx);
      if(item.bankDtlsAvailable){
        rows.push(this.gridObj.getDataItem(idx))
      }
    })
    if(!rows.length){
      this.toaster.error("No rows selected for payment instructions")
      return;
    }
    //check if instruction already submitted. to avoid multiple clicks on button
    if(this.instructionSubmitted){
      return;
    }
    this.instructionSubmitted = true;

    this.spinner.show();
    this.builtyService.exportInstructions(rows).subscribe(
      (res) => {
        this.spinner.hide();
        if(res.success){
          this.updaterows(rows);
          this.gridObj.setSelectedRows([]);
          this.windowRef.nativeWindow.open(AppConfig.API_ENDPOINT + "/builty/payment/downloadInstruction?key=" + res.data, '_blank');
          this.toaster.success("Payment instructions generated successfully");
        }else{
            this.toaster.error(res.message);
        }
        this.instructionSubmitted = false;
      },
      () => {
        this.spinner.hide();
        this.instructionSubmitted = false;
        this.toaster.error("Error while generating instruction");
      }
    )
  }

  updaterows(rows){
    //get the difference and update the rows in grid
    this.rowData = this.rowData.filter(data => !rows.includes(data));
    //this.gridObj.set
  }

  groupByPan(){
    this.angularGrid.dataView.setGrouping({
      getter: 'panNo',
      formatter:(item) => {
        return `<strong>${item.value}</strong>`
      },
      aggregators:[
        new Aggregators.Sum('freightBill'),
        new Aggregators.Avg('extraPayment')
      ]
    } as Grouping)
  }

  emptyStringFormatter(){
    return '';
  }

}
