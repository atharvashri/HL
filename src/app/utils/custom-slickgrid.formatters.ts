import { AppUtil } from './app.util';
import { Column } from 'angular-slickgrid';

export class CustomFormatters {

  static dateFormatter(row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any): string{
    if(value){
      return AppUtil.transformdate(value)
    }else{
      return "";
    }
  }

}
