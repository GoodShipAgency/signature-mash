import * as muhammara from 'muhammara';
import * as fs from "fs";
import * as Buffer from "buffer";

export default class PdfSigner {
    addSignature(pdfBuffer: Buffer, name: string, x: number, y: number, fontSize: number) {
        // generate unique filename
        const filename = 'tmp/file-' + Date.now() + Math.random() * 5000 + '.pdf';

        // write the buffer to a file
        fs.writeFileSync(filename, pdfBuffer);

        const reader = muhammara.createReader(filename);
        const pageCount = reader.getPagesCount();

        const writer = muhammara.createWriterToModify(filename, {
            modifiedFilePath: filename
        });

        let signatureFont = writer.getFontForFile(
            "resource/font/AgreementSignature.ttf"
        );
        let textFont = writer.getFontForFile(
            "resource/font/arial.ttf"
        );

        let maxSignatureWidth: number = 140;
        let defaultSignatureFontSize: number = parseInt(fontSize.toString());
        let signatureX: number = parseInt(x.toString());
        let signatureY: number = parseInt(y.toString());
        let textDimensions: muhammara.TextDimension = signatureFont.calculateTextDimensions(name, defaultSignatureFontSize);
        let fontSizeFactor: number = textDimensions.width / maxSignatureWidth;
        let signatureSize: number = defaultSignatureFontSize / fontSizeFactor;

        let maxNameWidth: number = 100;
        let defaultNameFontSize: number = parseInt(fontSize.toString());
        let nameX: number = signatureX + 209;
        let nameY: number = signatureY;
        textDimensions = textFont.calculateTextDimensions(name, defaultNameFontSize);
        fontSizeFactor = textDimensions.width / maxNameWidth;
        let nameSize: number = defaultNameFontSize / fontSizeFactor;

        let dateX: number = nameX + 155;
        let dateY: number = nameY;
        let dateSize: number = 12;

        let dateNow: Date = new Date();
        let dateString: string = dateNow.getDay() + '/' + (dateNow.getMonth()+1) + '/' + dateNow.getFullYear();

        let pageModifier = new muhammara.PDFPageModifier(writer, pageCount - 1, true);
        pageModifier
            .startContext()
            .getContext()
            // Signature
            .writeText(name, signatureX, signatureY, {
                font: signatureFont,
                size: signatureSize,
                colorspace: "gray",
                color: 0x00,
            })
            // Printed name
            .writeText(name, nameX, nameY, {
                font: textFont,
                size: nameSize,
                colorspace: "gray",
                color: 0x00,
            })
            // Date
            .writeText(dateString, dateX, dateY, {
                font: textFont,
                size: dateSize,
                colorspace: "gray",
                color: 0x00,
            });

        pageModifier.endContext().writePage();
        writer.end();

        const contents = fs.readFileSync(filename);

        fs.unlinkSync(filename);

        return contents;
    }

}