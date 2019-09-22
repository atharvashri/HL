import { FieldType, Column, Formatters } from 'angular-slickgrid';
import { AppUtil } from '../utils/app.util';
import { CustomFormatters } from '../utils/custom-slickgrid.formatters';

export class DOGridUtil {

    private static allColumns: Column[] = [
      { id: 'doId', name: 'DO ID', field: 'doDisplay', filterable: true, minWidth: 120, type: FieldType.string },
      { id: 'auctionNo', name: 'Auction No', field: 'auctionNo', filterable: true, maxWidth: 80, type: FieldType.number },
      { id: 'doDate', name: 'DO Date', field: 'doDate', filterable: true, sortable: true, formatter: CustomFormatters.dateFormatter, maxWidth: 100, type: FieldType.dateIso },
      { id: 'receivedDate', name: 'Received Date', field: 'receivedDate', filterable: true, sortable: true, formatter: CustomFormatters.dateFormatter, maxWidth: 100, type: FieldType.dateIso },
      { id: 'dueDate', name: 'Due Date', field: 'dueDate', filterable: true, sortable: true, formatter: CustomFormatters.dateFormatter, maxWidth: 100, type: FieldType.dateIso },
      { id: 'quantity', name: 'Quantity', field: 'quantity', sortable: true, filterable: true, maxWidth: 80, type: FieldType.number },
      { id: 'size', name: 'Size', field: 'size', filterable: true, type: FieldType.string},
      { id: 'party', name: 'Party', field: 'party', filterable: true, formatter: Formatters.complexObject, params: {complexFieldLabel: 'party.name'}},
      { id: 'destinationparty', name: 'Destination Party', field: 'destinationparty', filterable: true, formatter: Formatters.arrayObjectToCsv, params: {propertyNames: ['name']}},
      { id: 'permitNos', name: 'Permit No.', field: 'permitNos', filterable: true, type: FieldType.object},
      { id: 'grade', name: 'Grade', field: 'grade', filterable: true, type: FieldType.string},
      { id: 'by', name: 'By', field: 'by', filterable: true, type: FieldType.string},
      { id: 'doAmt', name: 'DO Amt', field: 'doAmt', filterable: true, type: FieldType.number},
      { id: 'doAmtPmt', name: 'DO Amt Pmt', field: 'doAmtPmt', filterable: true, type: FieldType.number},
      { id: 'doRate', name: 'DO Rate', field: 'doRate', filterable: true, type: FieldType.number},
      { id: 'doRateTcs', name: 'DO Rate TCS', field: 'doRateTcs', filterable: true, type: FieldType.number},
      { id: 'withinOutSide', name: 'Within/Outside', field: 'withinOutSide', filterable: true, type: FieldType.string},
      { id: 'liftedQuantity', name: 'Lifted Quantity', field: 'liftedQuantity', filterable: true, type: FieldType.number},
      { id: 'quantityDeduction', name: 'Quantity Deduction', field: 'quantityDeduction', filterable: true, type: FieldType.number},
      { id: 'lepseQuantity', name: 'Lepse Quantity', field: 'lepseQuantity', filterable: true, type: FieldType.number},
      { id: 'refundAmt', name: 'Refund Amt', field: 'refundAmt', filterable: true, type: FieldType.number},
      { id: 'refundDate', name: 'Refund Date', field: 'refundDate', filterable: true, maxWidth: 100, formatter: CustomFormatters.dateFormatter, type: FieldType.dateIso},
      { id: 'emdAmt', name: 'EMD Amt', field: 'emdAmt', filterable: true, type: FieldType.number},
      { id: 'website', name: 'Website', field: 'website', filterable: true, type: FieldType.string},
      { id: 'finishDate', name: 'Finish Date', field: 'finishDate', filterable: true, type: FieldType.string},
      { id: 'inAdvanceLimit', name: 'In Advance Limit', field: 'inAdvanceLimit', filterable: true, type: FieldType.number},
      { id: 'subTransporter', name: 'SubTransporter', field: 'subTransporter', filterable: true, formatter: Formatters.arrayObjectToCsv, params: {propertyNames: ['name']}, exportWithFormatter: true},
      { id: 'freightToBePaidBy', name: 'Freight To Be Paid By', field: 'freightToBePaidBy', filterable: true, type: FieldType.string},
      { id: 'otBuiltyCompany', name: 'OT Builty Company', field: 'otBuiltyCompany', filterable: true, type: FieldType.string},
      { id: 'createdBy', name: 'Created By', field: 'createdBy', filterable: true, type: FieldType.string},
      { id: 'createdDateTime', name: 'Created Time', field: 'createdDateTime', filterable: true, type: FieldType.string}
    ]

    private static visibleColumns: Column[] = [
      { id: 'doId', name: 'DO ID', field: 'doDisplay', filterable: true, minWidth: 120, type: FieldType.string },
      { id: 'doDate', name: 'DO Date', field: 'doDate', filterable: true, sortable: true, formatter: CustomFormatters.dateFormatter, maxWidth: 100, type: FieldType.dateIso },
      { id: 'receivedDate', name: 'Received Date', field: 'receivedDate', filterable: true, sortable: true, formatter: CustomFormatters.dateFormatter, maxWidth: 100, type: FieldType.dateIso },
      { id: 'doBalance', name: 'DO Balance', field: 'doBalance', sortable: true, filterable: true, maxWidth: 100, type: FieldType.number },
      { id: 'dueDate', name: 'Due Date', field: 'dueDate', filterable: true, sortable: true, formatter: CustomFormatters.dateFormatter, maxWidth: 100, type: FieldType.dateIso },
      { id: 'quantity', name: 'Quantity', field: 'quantity', sortable: true, filterable: true, maxWidth: 80, type: FieldType.number },
      { id: 'party', name: 'Party', field: 'party', filterable: true, formatter: Formatters.complexObject, params: {complexFieldLabel: 'party.name'}, exportWithFormatter: true},
      { id: 'destinationparty', name: 'Destination Party', field: 'destinationparty', filterable: true, formatter: Formatters.arrayObjectToCsv, params: {propertyNames: ['name']}, exportWithFormatter: true}
    ]

    static getVisibleColumnsForCompletedDO(){
      const cloned = [];
      return Object.assign(cloned, this.visibleColumns);
    }

    static getAllColumnsForDO(){
      const cloned = [];
      return Object.assign(cloned, this.allColumns);
    }
}
