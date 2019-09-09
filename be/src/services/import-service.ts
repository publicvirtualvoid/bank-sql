
import * as fs from 'fs-extra';
import * as path from 'path';
import * as xml from 'xml2js';
import { OFX } from '../interfaces';
import { BankAccount } from '../db/bank-account';
import { BankTransaction } from '../db/bank-transaction';
import * as datefns from 'date-fns';
import { Injectable, Logger } from "@nestjs/common";
import { Connection } from "typeorm";

const INDIR = 'input';

@Injectable()
export class ImportService {
  constructor(
    private readonly db: Connection,
    private readonly logger: Logger
    ) {}
  async import() {
    this.logger.log('[import] Importing...');
    const files = await fs.readdir(INDIR);
    const ofxFiles = files.filter(f => f.endsWith('.ofx'));
    
    for (const filePath of ofxFiles) {
      const absPath = path.join(INDIR, filePath);
      this.logger.debug(`[import] Processing ${absPath}`);
      const ofxString = await fs.readFile(absPath).then(f => f.toString());

      const ofxData: OFX.File = await xml.parseStringPromise(ofxString, {
        explicitArray: false,
      });

      const ccData = ofxData.OFX.CREDITCARDMSGSRSV1;
      if (ccData) {
        const accountId = ccData.CCSTMTTRNRS.CCSTMTRS.CCACCTFROM.ACCTID;
        let account = await this.upsertAccount(accountId, 'credit');
        await this.createTransactions(ccData.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST.STMTTRN, account);
      }

      const bankData = ofxData.OFX.BANKMSGSRSV1;
      if (bankData) {
        const accountId = bankData.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTID;
        let account = await this.upsertAccount(accountId, 'bank');
        await this.createTransactions(bankData.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN, account);
      }
    }
    this.logger.log('[import] Import complete.');
  }

  private async upsertAccount(accountId: string, typeString: 'bank' | 'credit') {
    const accounts = this.db.getRepository(BankAccount);
    let account = (await accounts.findByIds([accountId]))[0];
    if (!account) {
      account = await this.db.getRepository(BankAccount).create({
        id: accountId,
        type: typeString,
        transactions: []
      }).save();
    }
    return account;
  }

  private async createTransactions(bankTransactions: OFX.Stmttrn[], account: BankAccount) {
    for (const bankTransaction of bankTransactions) {
      const transactions = this.db.getRepository(BankTransaction);
      let transaction = (await transactions.findByIds([bankTransaction]))[0];
      if (!transaction) {
        transaction = await transactions.create({
          account,
          balance: 0,
          amount: parseFloat(bankTransaction.TRNAMT),
          date: datefns.parse(bankTransaction.DTPOSTED, 'yyyyMMdd', 0),
          name: bankTransaction.NAME,
          memo: bankTransaction.MEMO,
          fitId: bankTransaction.FITID,
        }).save();
      }
      let foo;
    }
  }
}