import * as fs from 'fs-extra';
import * as xml from 'xml2js';
import { OFX } from './interfaces';

(async function main() {
  const ofxString = await fs.readFile('input/tranhist.ofx').then(f => f.toString());

  const ofxData: OFX.OfxData = await xml.parseStringPromise(ofxString, {
    mergeAttrs: true,
    explicitArray: false,
  });

  const statementResponse = ofxData.OFX.CREDITCARDMSGSRSV1.STMTTRNRS.STMTRS;
  const accountId = statementResponse.BANKACCTFROM.ACCTID;
  const currencyCode = statementResponse.CURDEF;
  const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
  // do something...  

})()