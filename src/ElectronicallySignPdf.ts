import * as muhammara from 'muhammara';
import * as fs from "fs";
import * as Buffer from "buffer";
import {extractText} from "./textExtraction";

export default class ElectronicallySignPdf {
    addElectronicSignature(pdfBuffer: Buffer, name: string, signatureIndex = 1) {
        // generate unique filename
        const filename = 'tmp/file-' + Date.now() + Math.random() * 5000 + '.pdf';

        // write the buffer to a file
        fs.writeFileSync(filename, pdfBuffer);
        const reader = muhammara.createReader(filename);

        var pagesPlacements = extractText(reader);

        // flush the result
        console.log('pages text placements', JSON.stringify(pagesPlacements, null, 2));

        // create new version of file with rectangles around the text based on extraction info
        // if it is correct will have red rectangles around every piece of text
        const pdfWriter = muhammara.createWriterToModify(filename, {
            modifiedFilePath: filename
        });

        for (var i = 0; i < pagesPlacements.length; ++i) {
            var pageModifier = new muhammara.PDFPageModifier(pdfWriter, i);
            var cxt = pageModifier.startContext().getContext();
            pagesPlacements[i].forEach((placement: any) => {
                cxt.q();
                cxt.cm.apply(cxt, placement.matrix);
                cxt.drawRectangle(placement.localBBox[0], placement.localBBox[1], placement.localBBox[2] - placement.localBBox[0], placement.localBBox[3] - placement.localBBox[1], {
                    color: 'Red',
                    width: 1
                });
                cxt.Q();
            });
            pageModifier.endContext().writePage();
        }
        pdfWriter.end();

        const contents = fs.readFileSync(filename);
        fs.unlinkSync(filename);

        return contents;
    }
}