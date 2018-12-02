
export class AppUtil{
  static transformdate(date: string){
    if (date && date.length == 10) {
      return (<Array<string>>date.split('-')).reverse().join('-');
    }
    return "";
  }

  static currentdate(){
    let now = new Date();
    let _datestr = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    return _datestr;
  }

  public static ROLE_OFFICE: string = "ROLE_OFFICE";
  public static ROLE_FIELD: string = "ROLE_FIELD";
  public static ROLE_CUSTOMER: string = "ROLE_CUSTOMER";
  public static ROLE_TRUCK_OWNER: string = "ROLE_TRUCK_OWNER";
  public static ROLE_ADMIN: string = "ROLE_ADMIN";
  public static ROLE_OWNER: string = "ROLE_OWNER";
  public static ROLE_PASSIVE_OFFICE: string = "ROLE_PASSIVE_OFFICE";
  public static ANONYMOUS: string = "ANONYMOUS";
}
