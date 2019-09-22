import { Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, GridOption, FieldType, GroupTotalFormatters, Aggregators, Grouping } from 'angular-slickgrid';
import { BuiltyService } from '../../services/builty.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment-completion',
  templateUrl: './payment-completion.component.html',
  styleUrls: ['./payment-completion.component.scss']
})
export class PaymentCompletionComponent implements OnInit {

  angularGrid: AngularGridInstance;
  gridObj: any;
  allColumns: Column[];
  gridOptions: GridOption;
  rowData: Array<any> = [];
  pageSubmitted: boolean = false;

    constructor(private builtyService: BuiltyService,
          private toaster: ToastrService,
          private spinner: NgxSpinnerService) { }

    columnDefs: Column[] = [
          {id:'panNo', field: 'panNo', name: 'PAN', maxWidth: 120, sortable: true, filterable: true, type: FieldType.string, formatter: this.emptyStringFormatter},
          {id:'builtyNo', field: 'builtyNo', name: 'Builty No', maxWidth: 120, sortable: true, filterable: true, type: FieldType.string },
          {id:'vehicleNo', field: 'vehicleNo', name: 'Vehicle No', maxWidth: 120, sortable: true, filterable: true, type: FieldType.string },
          {id:'vehicleOwner', field: 'vehicleOwner', name: 'Owner', maxWidth: 150, sortable: true, filterable: true, type: FieldType.string },
          {id:'freightBill', field: 'freightBill', name: 'Freight', maxWidth: 120, sortable: true, filterable: true, type: FieldType.number, groupTotalsFormatter: GroupTotalFormatters.sumTotals, params: { groupFormatterPrefix: '<b>Total</b>: ' /*, groupFormatterSuffix: ' USD'*/ } }
      ];

    ngOnInit() {
      this.spinner.show();
      this.builtyService.getInitiatedPayments().subscribe(
        (res) => {
          this.spinner.hide();
          if(res.success){
            this.rowData = res.data;
            this.toaster.success(res.message);
            if(this.rowData.length){
              $('#complete-payment-container .btn-primary').prop("disabled", false);
              $('#complete-payment-container .btn-danger').prop("disabled", false);
            }else{
              $('.grid-canvas').html('<div>No Data is available for payment completion</div>');
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
          containerId: 'complete-payment-container'
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

    onGridReady(e){
        this.angularGrid = e;
        this.gridObj = this.angularGrid && this.angularGrid.slickGrid || {}
        //this.gridObj.setSelectionModel(new Slick.CheckboxSelectColumn())
        this.groupByPan()
    }

    markPaymentDone(){
      let selectedIdx: number[] = this.gridObj.getSelectedRows()
      let rows: any[] = [];
      selectedIdx.forEach(idx => {
        let item = this.gridObj.getDataItem(idx);
          rows.push(item);
      })

      if(rows.length){
        this.toaster.error("No rows selected for marking payment done");
        return;
      }

      //check if instruction already submitted. to avoid multiple clicks on button
      if(this.pageSubmitted){
        return;
      }
      this.pageSubmitted = true;

      this.spinner.show();
      this.builtyService.markComplete(rows).subscribe(
        (res) => {
          this.spinner.hide();
          if(res.success){
            this.updaterows(rows);
            this.gridObj.setSelectedRows([]);
            this.toaster.success("Payment completion marked successfully");
          }else{
            this.toaster.error(res.message);
          }
          this.pageSubmitted = false;
        },
        () => {
          this.spinner.hide();
          this.pageSubmitted = false;
          this.toaster.error("Error while marking payment completion");
        }
      )
    }

    paymentNotDone(){
      let selectedIdx: number[] = this.gridObj.getSelectedRows()
      let rows: any[] = [];
      selectedIdx.forEach(idx => {
        let item = this.gridObj.getDataItem(idx);
          rows.push(item);
      })

      if(rows.length){
        this.toaster.error("No rows selected for reverting payment instruction");
        return;
      }
      //check if instruction already submitted. to avoid multiple clicks on button
      if(this.pageSubmitted){
        return;
      }
      this.pageSubmitted = true;

      this.spinner.show();
      this.builtyService.markComplete(rows).subscribe(
        (res) => {
          this.spinner.hide();
          if(res.success){
            this.updaterows(rows);
            this.gridObj.setSelectedRows([]);
            this.toaster.success("Payment instruction reverted successfully");
          }else{
            this.toaster.error(res.message);
          }
          this.pageSubmitted = false;
        },
        () => {
          this.spinner.hide();
          this.pageSubmitted = false;
          this.toaster.error("Error while reverting payment instruction");
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
