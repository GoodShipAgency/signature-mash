import SignPDF from "./SignPDF.js";
import fs from "fs";
import path from "node:path";

(async function main() {
    const pdfBuffer = new SignPDF(
        path.resolve('resource/ExampleDocumentNoDefinedSignatureFields.pdf'),
        path.resolve('resource/keys/key.p12')
    );

    const signedDocs = await pdfBuffer.signPDF(0, 0, 1);

    // unix timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    const pdfName = `./exports/exported_file_${timestamp}.pdf`;

    fs.writeFileSync(pdfName, signedDocs);
    console.log(`New Signed PDF created called: ${pdfName}`);

    const resignBuffer = new SignPDF(
        pdfName,
        path.resolve('resource/keys/key.p12')
    );

    const reSignedDocs = await resignBuffer.signPDF(120, 0, 2);

    const reSignedPdfName = `./exports/exported_file_${timestamp}_resigned.pdf`;

    fs.writeFileSync(reSignedPdfName, reSignedDocs);
})();