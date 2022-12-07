import {
    PDFDocument,
    PDFName,
    PDFNumber,
    PDFHexString,
    PDFString,
    drawImage,
    drawRectangle,
    rgb,
    degrees
} from "pdf-lib";

import {SignPdf} from "node-signpdf";
import fs from "node:fs";

import PDFArrayCustom from "./PDFArrayCustom.js";
import {PDF_LIB_SIGNATURE} from "./Signature.js";

export default class SignPDF {
    constructor(pdfFile, certFile) {
        this.pdfDoc = fs.readFileSync(pdfFile);
        this.certificate = fs.readFileSync(certFile);
    }

    /**
     * @return Promise<Buffer>
     */
    async signPDF(x, y, signature) {
        const signer = new SignPdf();

        let newPDF = await this._addPlaceholder(x, y, signature);
        newPDF = signer.sign(newPDF, this.certificate, {passphrase: '1234'});

        return newPDF;
    }

    /**
     * @see https://github.com/Hopding/pdf-lib/issues/112#issuecomment-569085380
     * @returns {Promise<Buffer>}
     */
    async _addPlaceholder(x, y, signature) {
        const loadedPdf = await PDFDocument.load(this.pdfDoc);
        const ByteRange = PDFArrayCustom.withContext(loadedPdf.context);
        const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********';
        const SIGNATURE_LENGTH = 6000;
        const pages = loadedPdf.getPages();

        ByteRange.push(PDFNumber.of(0));
        ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
        ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
        ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));

        const signatureDict = loadedPdf.context.obj({
            Type: 'Sig',
            Filter: 'Adobe.PPKLite',
            SubFilter: 'adbe.pkcs7.detached',
            ByteRange,
            Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
            Reason: PDFString.of('We need your signature for reasons...'),
            M: PDFString.fromDate(new Date()),
        });

        const signatureDictRef = loadedPdf.context.register(signatureDict);

        const widgetDict = loadedPdf.context.obj({
            Type: 'Annot',
            Subtype: 'Widget',
            FT: 'Sig',
            Rect: [x, y, 100, 100], // Signature rect size
            V: signatureDictRef,
            T: PDFString.of('Signature' + signature),
            F: 4,
            P: pages[0].ref,
        });

        const widgetDictRef = loadedPdf.context.register(widgetDict);

        // Add signature widget to the last page
        pages[pages.length - 1].node.set(PDFName.of('Annots'), loadedPdf.context.obj([widgetDictRef]));

        loadedPdf.catalog.set(
            PDFName.of('AcroForm'),
            loadedPdf.context.obj({
                SigFlags: 3,
                Fields: [widgetDictRef],
            })
        );

        const form = loadedPdf.getForm();
        const sig = form.getSignature('Signature' + signature);

        const pdfLibSigImg = await loadedPdf.embedPng(PDF_LIB_SIGNATURE);
        const pdfLibSigImgName = 'PDF_LIB_SIG_IMG';

        sig.acroField.getWidgets().forEach((widget) => {
            const {context} = widget.dict;
            const {width, height} = widget.getRectangle();

            const appearance = [
                ...drawRectangle({
                    x: x,
                    y: y,
                    width,
                    height,
                    borderWidth: 1,
                    color: rgb(1, 0, 0),
                    borderColor: rgb(1, 0.5, 0.75),
                    rotate: degrees(0),
                    xSkew: degrees(0),
                    ySkew: degrees(0),
                }),

                ...drawImage(pdfLibSigImgName, {
                    x: x+5,
                    y: y+5,
                    width: width - 10,
                    height: height - 10,
                    rotate: degrees(0),
                    xSkew: degrees(0),
                    ySkew: degrees(0),
                }),
            ];

            const stream = context.formXObject(appearance, {
                Resources: {XObject: {[pdfLibSigImgName]: pdfLibSigImg.ref}},
                BBox: context.obj([0, 0, width, height]),
                Matrix: context.obj([1, 0, 0, 1, 0, 0]),
            });
            const streamRef = context.register(stream);

            widget.setNormalAppearance(streamRef);
        });

        // Allows signatures on newer PDFs
        // @see https://github.com/Hopding/pdf-lib/issues/541
        const pdfBytes = await loadedPdf.save({useObjectStreams: false});

        return SignPDF.unit8ToBuffer(pdfBytes);
    }

    /**
     * @param {Uint8Array} unit8
     */
    static unit8ToBuffer(unit8) {
        let buf = Buffer.alloc(unit8.byteLength);
        const view = new Uint8Array(unit8);

        for (let i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    }
}