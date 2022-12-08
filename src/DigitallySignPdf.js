import {SignPdf} from "node-signpdf";
import {plainAddPlaceholder} from "node-signpdf/dist/helpers/index.js";
import fs from "fs";

export default class DigitallySignPdf {

    sign(pdfBuffer, p12Buffer, name, reason, location, contactInfo) {
        const signer = new SignPdf();

        pdfBuffer = plainAddPlaceholder({
            pdfBuffer,
            reason,
            name,
            location,
            contactInfo,
        });

        return signer.sign(pdfBuffer, p12Buffer, {passphrase: '1234'});
    }
}