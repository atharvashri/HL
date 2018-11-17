
export class AppUtil{
  static transfordate(date: string){
    if (date && date.length == 10) {
      return (<Array<string>>date.split('-')).reverse().join('-');
    }
    return "";
  }
}
