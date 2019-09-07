import * as fs from 'fs-extra';
import * as path from 'path';
import * as xml from 'xml2js';
import { OFX } from './interfaces';
import * as typeorm from "typeorm";
import { BankAccount } from './db/bank-account';
import { BankTransaction } from './db/bank-transaction';
import * as datefns from 'date-fns';

const INDIR = 'input';

(async function main() {
  const db = await typeorm.createConnection();
  await db.synchronize();
  const files = await fs.readdir(INDIR);
  const ofxFiles = files.filter(f => f.endsWith('.ofx'));
  
  for (const filePath of ofxFiles) {
    const ofxString = await fs.readFile(path.join(INDIR, filePath)).then(f => f.toString());

    const ofxData: OFX.File = await xml.parseStringPromise(ofxString, {
      explicitArray: false,
    });

    const ccData = ofxData.OFX.CREDITCARDMSGSRSV1;
    if (ccData) {
      const accountId = ccData.CCSTMTTRNRS.CCSTMTRS.CCACCTFROM.ACCTID;
      const accounts = db.getRepository(BankAccount);
      let account = (await accounts.findByIds([accountId]))[0];
      if (!account) {
        account = await db.getRepository(BankAccount).create({
          id: accountId,
          type: 'credit',
          transactions: []
        }).save();
      }

      await createTransactions(ccData.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST.STMTTRN, db, account);
    }

    const bankData = ofxData.OFX.BANKMSGSRSV1;
    if (bankData) {
      const accountId = bankData.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTID;
      const accounts = db.getRepository(BankAccount);
      let account = (await accounts.findByIds([accountId]))[0];
      if (!account) {
        account = await db.getRepository(BankAccount).create({
          id: accountId,
          type: 'bank',
          transactions: []
        }).save();
      }

      await createTransactions(bankData.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN, db, account);
    }
  }

})()

async function createTransactions(bankTransactions: OFX.Stmttrn[], db: typeorm.Connection, account: BankAccount) {
  for (const bankTransaction of bankTransactions) {
    const transactions = db.getRepository(BankTransaction);
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
