import * as muhammara from 'muhammara';
import * as fs from "fs";
import * as Buffer from "buffer";

export default class ElectronicallySignPdf {
    addElectronicSignature(pdfBuffer: Buffer, name: string, x: number, y: number, size: number) {
        // generate unique filename
        const filename = 'tmp/file-' + Date.now() + Math.random() * 5000 + '.pdf';

        // write the buffer to a file
        fs.writeFileSync(filename, pdfBuffer);

        const reader = muhammara.createReader(filename);
        const pageCount = reader.getPagesCount();

        const writer = muhammara.createWriterToModify(filename, {
            modifiedFilePath: filename
        });

        let pageModifier = new muhammara.PDFPageModifier(writer, pageCount - 1, true);
        pageModifier
            .startContext()
            .getContext()
            .writeText(name, x, y, {
                font: writer.getFontForFile(
                    "resource/font/AgreementSignature.ttf"
                ),
                size,
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