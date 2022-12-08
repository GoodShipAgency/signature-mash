/** @ts-ignore NoImplicitAny **/
import {SignPdf} from "node-signpdf";
/** @ts-ignore NoImplicitAny **/
import {plainAddPlaceholder} from "node-signpdf/dist/helpers/index.js";
import * as Buffer from "buffer";

export default class DigitallySignPdf {

    sign(pdfBuffer: Buffer, p12Buffer: Buffer, name: string, reason: string, location: string, contactInfo: string) {
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