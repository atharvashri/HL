
export class DODetails {
    public bspDoNo: number;
    public areaDoNo: number;
    public auctionNo: number;
    public quantity: number;
    public doDate: Date;
    public receivedDate: Date;
    public dueDate: Date;
    public size: string;
    public party: {
        id: number;
        name: string;
        destinations: Array<any>;
        freightRanges: Array<any>
    };
    public destinations: Array<any>;
    public destinationParty: [{
        id: number;
        name: string;
        destinations: Array<any>;
        freightRanges: Array<any>
    }];
    public freight: {
        min: number;
        max: number
    };
    public permissionNo: number;
    public area: string;
    public collary: string;
    public grade: string;
    public by: string;
    public builtyCompany: string;
    public transporter: string;
    public emd: number;
    public doAmt: number;
    public doAmtpmt: number;
    public doRate: number;
    public doRateTcs: number;
    public withinOutSide: number;
    public disp: string;
    public liftedQuantity: number;
    public quantityDeduction: number;
    public lepseQuantity: number;
    public doStatus: string;
    public refundAmt: number;
    public refundDate: Date;
    public emdAmt: number;
    public totalRefundAmt: number;
    public website: string;
    public finishDate: Date;
    public remarks: String;
    public inAdvanceLimit: Array<any>;
    public freightToBePaidBy: Array<any>

    constructor() {

    }
}
