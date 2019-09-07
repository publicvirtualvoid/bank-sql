export namespace OFX {
  export interface asdas {
    CCSTMTTRNRS: {
      AVAILBAL: any;
      BANKTRANLIST: {
        DTEND: string;
        DTSTART: string;
        STMTTRN: {
          /** Date */
          DTPOSTED: string;
          FITID: string;
          MEMO: string;
          /** Recipient */
          NAME: string;
          /** Amount */
          TRNAMT: string;
          TRNTYPE: string;
        }[]
      };
      CCACCTFROM: {
        ACCTID: string;
      };
      CURDEF: string;
      LEDGERBAL: {
        BALAMT: string;
        DTASOF: string;
      }
    }
  }
  export interface OfxData {
    header: any;
    OFX: {
      CREDITCARDMSGSRSV1?: asdas;
      BANKMSGSRSV1?: asdas;
      SIGNONMSGSRSV1: any;
    };
  }
}