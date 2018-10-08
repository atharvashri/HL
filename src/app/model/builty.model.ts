
export class Builty {
    public builtyNo: number;
    public doId: number;
    public doDisplay: Date;
    public party: {
        id: number;
        name: String;
        destinations: Array<string>;
        freightRanges: Array<string>;

    };
    public builtyDate: Date;
    public otBuiltyCompany: String;
    public otBuiltyNumber: number;
    public vehicleNo: String;
    public quantity: number;
    public inAdvance: number;
    public outAdvance: number;
    public diesel: number;
    public pumpName: String;
    public freight: number;
    public totalAdvance: number;
    public permitNo: number;
    public permitBalance: number;
    public permitEndDate: Date;
    public igpNo: number;
    public invoiceNo: number;
    public invoiceValue: number;
    public driverName: string;
    public driverMobile: number;
    public grossWeight: number;
    public tierWeight: number;
    public doBalance: number;
    public transporter: {
        userName: string;
        firstName: string;
        lastName: string;
        password: string;
        role: string;
        active: boolean
    };
    public subTransporter: {
        userName: string;
        firstName: string;
        lastName: string;
        password: string;
        role: string;
        active: boolean
    };
    public waybillNo: string;
    public tpNo: string;
    public receivedDate: Date;
    public receivedQuantity: number;
    public netWeight: number;
    public refund: number;
    public assesibleValue: number;
    public freightToBePaidBy: string;
    public inAdvanceLimit: number
}
