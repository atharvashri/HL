import { FieldType, Column, Formatters, Filters } from 'angular-slickgrid';
import { AppUtil } from '../utils/app.util';
import { CustomFormatters } from '../utils/custom-slickgrid.formatters';

export class BuiltyGridUtil {

    private static allColumns: Column[] = [
      { id: 'builtyNo', name: 'Bilty No.', field: 'builtyNo', filterable: true, minWidth: 100, type: FieldType.string},
      { id: 'doId', name: 'DO', field: 'doDisplay', filterable: true, sortable: true, minWidth: 150, type: FieldType.string },
      { id: 'biltyDate', name: 'Bilty Date', field: 'builtyDate', sortable: true,
            formatter: CustomFormatters.dateFormatter, minWidth: 100, type: FieldType.dateIso},
      { id: 'vehicleNo', name: 'Vehicle No.', field: 'vehicleNo', filterable: true, sortable: true, minWidth: 120, type: FieldType.string },
      { id: 'netWeight', name: 'Net Weight', field: 'netWeight', sortable: true, filterable: true, minWidth: 100,
            type: FieldType.number, filter: { model: Filters.compoundInputNumber } },
      { id: 'party', name: 'Party', field: 'party', filterable: true, minWidth: 120, type: FieldType.string},
      { id: 'destination', name: 'Destination', field: 'destination', filterable: true, minWidth: 100, type: FieldType.string},
      { id: 'freight', name: 'Freight', field: 'freight', filterable: true, type: FieldType.number},
      { id: 'driver', name: 'Driver', field: 'driverName', type: FieldType.string},
      { id: 'mobile', name: 'Mobile', field: 'driverMobile', type: FieldType.number},
      { id: 'grossWeight', name: 'Gross Weight', field: 'grossWeight', sortable: true, filterable: true, maxWidth: 80, type: FieldType.number },
      { id: 'tierWeight', name: 'Tier Weight', field: 'tierWeight', sortable: true, filterable: true, maxWidth: 80, type: FieldType.number },
      { id: 'otBuiltyCompany', name: 'OT Builty Company', field: 'otBuiltyCompany', filterable: true, type: FieldType.string},
      { id: 'otBuiltyNumber', name: 'OT Builty Number', field: 'otBuiltyNumber', filterable: true, type: FieldType.number},
      { id: 'inAdvance', name: 'In Advance', field: 'inAdvance', filterable: true, type: FieldType.number},
      { id: 'outAdvance', name: 'Out Advance', field: 'outAdvance', filterable: true, type: FieldType.number},
      { id: 'diesel', name: 'Diesel', field: 'diesel', filterable: true, type: FieldType.number},
      { id: 'pumpName', name: 'Pump Name', field: 'pumpName', filterable: true, maxWidth: 120, type: FieldType.string},
      { id: 'totalCashAdvance', name: 'Total Cash Advance', field: 'totalCashAdvance', filterable: true, type: FieldType.number},
      { id: 'totalAdvance', name: 'Total Advance', field: 'totalAdvance', filterable: true, type: FieldType.number},
      { id: 'permitNo', name: 'Permit No', field: 'permitNo', filterable: true, type: FieldType.number},
      { id: 'igpNo', name: 'IGP No', field: 'igpNo', filterable: true, type: FieldType.number},
      { id: 'invoiceNo', name: 'Invoice No', field: 'invoiceNo', filterable: true, type: FieldType.number},
      { id: 'invoiceValue', name: 'Invoice Value', field: 'invoiceValue', filterable: true, type: FieldType.number},
      { id: 'subTransporter', name: 'SubTransporter', field: 'subTransporter', filterable: true, type: FieldType.string},
      { id: 'waybillNo', name: 'Way Bill No', field: 'waybillNo', filterable: true, type: FieldType.string},
      { id: 'tpNo', name: 'TP No', field: 'tpNo', filterable: true, type: FieldType.string},
      { id: 'receivedDate', name: 'Received Date', field: 'receivedDate', filterable: true, formatter: CustomFormatters.dateFormatter, maxWidth: 100, type: FieldType.dateIso },
      { id: 'receivedQuantity', name: 'Received Quantity', field: 'receivedQuantity', filterable: true, type: FieldType.number},
      { id: 'assesibleValue', name: 'Assesible Value', field: 'assesibleValue', filterable: true, type: FieldType.number},
      { id: 'freightToBePaidBy', name: 'Freight To Be Paid By', field: 'freightToBePaidBy', filterable: true, type: FieldType.string},
      { id: 'freightBill', name: 'Freight Bill', field: 'freightBill', filterable: true, type: FieldType.number},
      { id: 'otherDeduction', name: 'Other Deduction', field: 'otherDeduction', filterable: true, type: FieldType.number},
      { id: 'deductionRemark', name: 'Deduction Remark', field: 'deductionRemark', filterable: true, type: FieldType.string},
      { id: 'createdBy', name: 'Created By', field: 'createdBy', filterable: true, type: FieldType.string},
      { id: 'createdDateTime', name: 'Created Time', field: 'createdDateTime', filterable: true, type: FieldType.string}
    ]

    private static visibleColumns: Column[] = [
      { id: 'builtyNo', name: 'Bilty No.', field: 'builtyNo', filterable: true, minWidth: 100, type: FieldType.string},
      { id: 'doId', name: 'DO', field: 'doDisplay', filterable: true, sortable: true, minWidth: 150, type: FieldType.string },
      { id: 'biltyDate', name: 'Bilty Date', field: 'builtyDate', sortable: true,
            formatter: CustomFormatters.dateFormatter, minWidth: 100, type: FieldType.dateIso},
      { id: 'vehicleNo', name: 'Vehicle No.', field: 'vehicleNo', filterable: true, sortable: true, minWidth: 120, type: FieldType.string },
      { id: 'netWeight', name: 'Net Weight', field: 'netWeight', sortable: true, filterable: true, minWidth: 100,
            type: FieldType.number, filter: { model: Filters.compoundInputNumber } },
      { id: 'party', name: 'Party', field: 'party', filterable: true, minWidth: 120, type: FieldType.string},
      { id: 'destination', name: 'Destination', field: 'destination', filterable: true, minWidth: 100, type: FieldType.string},
      { id: 'freight', name: 'Freight', field: 'freight', filterable: true, type: FieldType.number},
      { id: 'driver', name: 'Driver', field: 'driverName', type: FieldType.string},
      { id: 'mobile', name: 'Mobile', field: 'driverMobile', type: FieldType.number}
    ]

    static getVisibleColumnsForCompletedBilty(){
      const cloned = [];
      return Object.assign(cloned, this.visibleColumns);
    }

    static getAllColumnsForBilty(){
      const cloned = [];
      return Object.assign(cloned, this.allColumns);
    }




}
