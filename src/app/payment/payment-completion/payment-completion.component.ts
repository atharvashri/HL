import { Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, GridOption, FieldType, GroupTotalFormatters, Aggregators, Grouping } from 'angular-slickgrid';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentInstruction } from '../../model/payment.instruction.model';

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
  rowData: Array<PaymentInstruction> = [];
  pageSubmitted: boolean = false;

    constructor(private paymentService: PaymentService,
          private toaster: ToastrService,
          private spinner: NgxSpinnerService) { }

    columnDefs: Column[] = [
          {id:'instructionDate', field: 'instructionDate', name: 'Instruction Time', maxWidth: 120, type: FieldType.string, formatter: this.emptyStringFormatter},
          {id:'panNo', field: 'pan', name: 'PAN', maxWidth: 120, sortable: true, filterable: true},
          {id:'accountNumber', field: 'accountNumber', name: 'Account Number', maxWidth: 120, sortable: true, filterable: true, type: FieldType.string },
          {id:'accoundHolder', field: 'accountHoldername', name: 'Account Holder', maxWidth: 120, sortable: true, filterable: true, type: FieldType.string },
          {id:'bankName', field: 'bankName', name: 'Bank', maxWidth: 150, sortable: true, filterable: true, type: FieldType.string },
          {id:'branchName', field: 'branchName', name: 'Branch', maxWidth: 120, sortable: true, filterable: true},
          {id:'ifscCode', field: 'ifscCode', name: 'IFSC', maxWidth: 150, sortable: true, filterable: true, type: FieldType.string },
          {id:'total', field: 'total', name: 'Total', maxWidth: 150, sortable: true, filterable: true, type: FieldType.number, groupTotalsFormatter: GroupTotalFormatters.sumTotals, params: { groupFormatterPrefix: '<b>Total</b>: ' /*, groupFormatterSuffix: ' USD'*/ }  },
          {id:'prevAdjustment', field: 'prevAdjustment', name: 'Previous Adjustment', maxWidth: 150, sortable: true, filterable: false, type: FieldType.number }
      ];

    ngOnInit() {
      this.spinner.show();
      this.paymentService.getPendingForCompletion().subscribe(
        (res) => {
          this.spinner.hide();
          if(res.success){
            //this.rowData = res.data;
            this.toaster.success(res.message);
            if(res.data.length){
              //convert it to displayble format
              //this.rowData = this.transFormDataForUI(res.data);
              this.rowData = res.data;
              $('#complete-payment-container .btn-primary').prop("disabled", false);
              $('#complete-payment-container .btn-danger').prop("disabled", false);
            }else{
              $('.grid-canvas').html('<div>No Data is available for payment completion</div>');
            }
          }else{
            this.toaster.error("Internal server error: " + res.message);
          }
        },
        () => {
            this.spinner.hide();
            this.toaster.error("Error in retrieving instructions");
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
        this.groupByInstructions()
    }

    markPaymentDone(){
      let selectedIdx: number[] = this.gridObj.getSelectedRows()
      let rows: any[] = [];
      selectedIdx.forEach(idx => {
        let item = this.gridObj.getDataItem(idx);
          rows.push(item);
      })

      if(!rows.length){
        this.toaster.error("No rows selected for marking payment done");
        return;
      }

      //check if instruction already submitted. to avoid multiple clicks on button
      if(this.pageSubmitted){
        return;
      }
      this.pageSubmitted = true;

      this.spinner.show();
      this.paymentService.markComplete(rows).subscribe(
        (res) => {
          this.spinner.hide();
          if(res.success){
            this.updaterows(rows);
            this.gridObj.setSelectedRows([]);
            this.toaster.success("Payment completion marked successfully for selected builties");
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

      if(!rows.length){
        this.toaster.error("No rows selected for reverting payment instruction");
        return;
      }
      //check if instruction already submitted. to avoid multiple clicks on button
      if(this.pageSubmitted){
        return;
      }
      this.pageSubmitted = true;

      this.spinner.show();
      this.paymentService.revertPaymentInstruction(rows).subscribe(
        (res) => {
          this.spinner.hide();
          if(res.success){
            this.updaterows(rows);
            this.gridObj.setSelectedRows([]);
            this.toaster.success("Payment instruction reverted successfully for selected builties");
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

    groupByInstructions(){
      this.angularGrid.dataView.setGrouping({
        getter: 'instructionDate',
        formatter:(item) => {
          return `<strong>${item.value}</strong>`
        },
        aggregators:[
          new Aggregators.Sum('total'),
        ]
      } as Grouping)
    }

    emptyStringFormatter(){
      return '';
    }

    transFormDataForUI(data: any): PaymentInstruction[]{
      let _instructions = [];
      if(data && data.length){
        data.forEach(item => {
            item.instructionsByPan.forEach(panDetail => {
                let _instruction = new PaymentInstruction();
                _instruction.id = item.id + ' - ' + panDetail.pan;
                _instruction.instructionId = item.id;
                _instruction.instructionDate = item.instructionDateTime;
                _instruction.pan = panDetail.pan;
                _instruction.accountNumber = panDetail.accountNumber;
                _instruction.accountHoldername = panDetail.accountHolderName;
                _instruction.bankName = panDetail.bankName;
                _instruction.branchName = panDetail.branchName;
                _instruction.ifscCode = panDetail.ifscCode;
                _instruction.bilties = panDetail.bilties;
                _instruction.total = panDetail.total;

                _instructions.push(_instruction);
            });
        });
      }
      return _instructions;
    }

}
