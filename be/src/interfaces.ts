export namespace OFX {
  export interface File {
    OFX: Ofx;
  }

  export interface Ofx {
      SIGNONMSGSRSV1:     Signonmsgsrsv1;
      CREDITCARDMSGSRSV1: Creditcardmsgsrsv1;
      BANKMSGSRSV1:   Bankmsgsrsv1;
  }

  export interface Bankmsgsrsv1 {
      STMTTRNRS: Stmttrnrs;
  }

  export interface Creditcardmsgsrsv1 {
      CCSTMTTRNRS: Ccstmttrnrs;
  }

  export interface Stmttrnrs {
      TRNUID: string;
      STATUS: Status;
      STMTRS: Stmtrs;
  }

  export interface Ccstmttrnrs {
      TRNUID:   string;
      STATUS:   Status;
      CCSTMTRS: Ccstmtrs;
  }

  export interface Stmtrs {
      CURDEF:       string;
      BANKACCTFROM: Bankacctfrom;
      BANKTRANLIST: Banktranlist;
      LEDGERBAL:    BAL;
      AVAILBAL:     BAL;
  }

  export interface Bankacctfrom {
      BANKID:   string;
      ACCTID:   string;
      ACCTTYPE: string;
  }

  export interface Ccstmtrs {
      CURDEF:       string;
      CCACCTFROM:   Ccacctfrom;
      BANKTRANLIST: Banktranlist;
      LEDGERBAL:    BAL;
      AVAILBAL:     BAL;
  }

  export interface BAL {
      BALAMT: string;
      DTASOF: string;
  }

  export interface Banktranlist {
      DTSTART: string;
      DTEND:   string;
      STMTTRN: Stmttrn[];
  }

  export interface Stmttrn {
      TRNTYPE:  Trntype;
      DTPOSTED: string;
      TRNAMT:   string;
      FITID:    string;
      NAME:     string;
      MEMO:     string;
  }

  export enum Trntype {
      Debit = "DEBIT",
  }

  export interface Ccacctfrom {
      ACCTID: string;
  }

  export interface Status {
      CODE:     string;
      SEVERITY: string;
      MESSAGE:  string;
  }

  export interface Signonmsgsrsv1 {
      SONRS: Sonrs;
  }

  export interface Sonrs {
      STATUS:   Status;
      DTSERVER: string;
      LANGUAGE: string;
  }
}