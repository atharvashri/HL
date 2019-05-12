
export class DO {
    public doId: number;
    public collaryName: string;
    public quantity: number;
    public areaDoNo: number;
    public bspDoNo: number;
    public doNo: string;
    public doDisplay: string;
    public selected: boolean;

    constructor(doId: number, collaryName: string, quantity: number, areaDoNo: number, bspDoNo: number){
      this.doId = doId;
      this.collaryName = collaryName;
      this.quantity = quantity;
      this.areaDoNo = areaDoNo;
      this.bspDoNo = bspDoNo;
      this.doNo = this.areaDoNo + "/" + this.bspDoNo;
      this.doDisplay = this.doNo + "-" + this.collaryName + "-" + this.quantity;
      this.selected = false;
    }
}
