import SignPDF from "./SignPDF.js";
import SignPDFHummus from "./SignPDFHummus.js";
import fs from "fs";
import path from "node:path";
import {extractSignature, plainAddPlaceholder} from "node-signpdf/dist/helpers/index.js";
import {SignPdf} from "node-signpdf";

(async function main() {
    const p12Buffer = fs.readFileSync('./resource/keys/key.p12');
    const signer = new SignPDFHummus();

    const originalPath = './resource/ExampleDocumentNoDefinedSignatureFields.pdf';
    // unix timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    const masterPath = `./exports/Document-${timestamp}_master.pdf`;
    fs.copyFile(originalPath, masterPath, (err) => {});

    // Sign the original
    const signedOriginalPath = `./exports/Document-${timestamp}_original_signed.pdf`;
    signer.sign(originalPath, signedOriginalPath, p12Buffer, 'Original non-electronically signed document digitally signed by server for review');

    // Add first signature
    const firstSignaturePath = `./exports/Document-${timestamp}_signature_1.pdf`;
    signer.addElectronicSignature(masterPath, masterPath, {
        name: 'Karl Matthew Jacques',
        signature: 1,
    });

    signer.sign(masterPath, firstSignaturePath, p12Buffer, 'Signed by Karl Matthew Jacques - not yet complete');

    // Add second signature
    const secondSignaturePath = `./exports/Document-${timestamp}_signature_2.pdf`;
    signer.addElectronicSignature(masterPath, masterPath, {
        name: 'Amy Kate Blackburn',
        signature: 2,
    });

    signer.sign(masterPath, secondSignaturePath, p12Buffer, 'Signed by Amy Kate Blackburn - not yet complete');

})();