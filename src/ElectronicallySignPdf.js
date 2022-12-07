import muhammara from 'muhammara';

export default class ElectronicallySignPdf {
    addElectronicSignature(pdfBuffer, name, signatureIndex =1 ) {
        const pdfStream = new muhammara.PDFRStreamForBuffer(pdfBuffer);
        const reader = muhammara.createReader(pdfStream);
        const pageCount = reader.getPagesCount();

        let pdfOutStream = new muhammara.PDFWStreamForBuffer();
        const writer = muhammara.createWriterToModify(pdfStream, pdfOutStream);

        let pageModifier = new muhammara.PDFPageModifier(writer, pageCount - 1, true);
        pageModifier
            .startContext()
            .getContext()
            .writeText('Test', 150, 510 - ((signatureIndex - 1) * 20), {
                font: writer.getFontForFile(
                    "resource/font/AgreementSignature.ttf"
                ),
                size: 14,
                colorspace: "gray",
                color: 0x00,
            });

        pageModifier.endContext().writePage();
        writer.end();

        return pdfOutStream.buffer;
    }

}