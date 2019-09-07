import * as fs from 'fs-extra';
import * as path from 'path';
import * as xml from 'xml2js';
import { OFX } from './interfaces';

const INDIR = 'input';

(async function main() {
  const files = await fs.readdir(INDIR);
  const ofxFiles = files.filter(f => f.endsWith('.ofx'));
  
  for (const filePath of ofxFiles) {
    const ofxString = await fs.readFile(path.join(INDIR, filePath)).then(f => f.toString());

    const ofxData: OFX.File = await xml.parseStringPromise(ofxString, {
      explicitArray: false,
    });

    const statementResponse = ofxData.OFX.CREDITCARDMSGSRSV1.STMTTRNRS.STMTRS;
    const accountId = statementResponse.BANKACCTFROM.ACCTID;
    const currencyCode = statementResponse.CURDEF;
    const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
    // do something...  
  }

})()