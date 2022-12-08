"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const muhammara = require("muhammara");
const fs = require("fs");
class ElectronicallySignPdf {
    addElectronicSignature(pdfBuffer, name, signatureIndex = 1) {
        const filename = 'tmp/file-' + Date.now() + Math.random() * 5000 + '.pdf';
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
            .writeText(name, 150, 510 - ((signatureIndex - 1) * 20), {
            font: writer.getFontForFile("resource/font/AgreementSignature.ttf"),
            size: 14,
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
exports.default = ElectronicallySignPdf;
//# sourceMappingURL=ElectronicallySignPdf.js.map