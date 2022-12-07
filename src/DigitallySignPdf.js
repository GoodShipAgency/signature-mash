import {SignPdf} from "node-signpdf";
import {plainAddPlaceholder} from "node-signpdf/dist/helpers/index.js";
import fs from "fs";

export default class DigitallySignPdf {

    sign(pdfPath, pdfOutputPath, p12Buffer, reason) {
        const signer = new SignPdf();

        let pdfBuffer = fs.readFileSync(pdfPath);
        pdfBuffer = plainAddPlaceholder({
            pdfBuffer,
            reason,
        });
        pdfBuffer = signer.sign(pdfBuffer, p12Buffer, {passphrase: '1234'});

        fs.writeFileSync(pdfOutputPath, pdfBuffer);
    }
}