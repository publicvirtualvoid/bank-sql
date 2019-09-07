import { parse as parseOFX } from 'ofx-js';
import * as fs from 'fs-extra';

(async function main() {
  const ofxString = await fs.readFile('input/tranhist.ofx').then(f => f.toString());

  const ofxData = await parseOFX(ofxString)

  const statementResponse = ofxData.OFX.CREDITCARDMSGSRSV1.STMTTRNRS.STMTRS;
  const accountId = statementResponse.BANKACCTFROM.ACCTID;
  const currencyCode = statementResponse.CURDEF;
  const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
  // do something...  

})()