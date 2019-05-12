
export class AppUtil{
  static transformdate(date: string){
    if (date && date.length == 10) {
      return (<Array<string>>date.split('-')).reverse().join('-');
    }
    return "";
  }

  static currentdate(){
    let now = new Date();
    let gmtDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    //let _datestr = now.getDate() + '-' + (now.getMonth()+1) + '-' + now.getFullYear();
    //let _datestr = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    //return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return gmtDate.toISOString().substring(0, 10);
  }

  public static ROLE_OFFICE: string = "ROLE_OFFICE";
  public static ROLE_FIELD: string = "ROLE_FIELD";
  public static ROLE_CUSTOMER: string = "ROLE_CUSTOMER";
  public static ROLE_TRUCK_OWNER: string = "ROLE_TRUCK_OWNER";
  public static ROLE_ADMIN: string = "ROLE_ADMIN";
  public static ROLE_OWNER: string = "ROLE_OWNER";
  public static ROLE_PASSIVE_OFFICE: string = "ROLE_PASSIVE_OFFICE";
  public static ANONYMOUS: string = "ANONYMOUS";

  public static defaultLandingRoute(roleName){
    switch(roleName){
      case AppUtil.ROLE_ADMIN:
      case AppUtil.ROLE_OFFICE: return '/do';
      case AppUtil.ROLE_FIELD: return '/builty';
      case AppUtil.ROLE_PASSIVE_OFFICE: return '/runningdo';
      case AppUtil.ROLE_TRUCK_OWNER: return '/truckownerreport';
      case AppUtil.ROLE_CUSTOMER: return '/dispatchreport';
      case AppUtil.ROLE_OWNER: return '/reportowner';
      default: return '/login';
    }
  }
}
