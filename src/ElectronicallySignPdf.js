import muhammara from 'muhammara';

export default class ElectronicallySignPdf {
    addElectronicSignature(pdfPath, pdfOutputPath, additionalOptions = {}) {
        const name = additionalOptions.name;
        const signature = additionalOptions.signature || 1;

        const reader = muhammara.createReader(pdfPath);
        const pageCount = reader.getPagesCount();

        const writer = muhammara.createWriterToModify(pdfPath, {
            modifiedFilePath:
            pdfOutputPath
        });

        let pageModifier = new muhammara.PDFPageModifier(writer, pageCount - 1, true);
        pageModifier
            .startContext()
            .getContext()
            .writeText(name, 150, 510 - ((signature - 1) * 20), {
                font: writer.getFontForFile(
                    "resource/font/AgreementSignature.ttf"
                ),
                size: 14,
                colorspace: "gray",
                color: 0x00,
            });

        pageModifier.endContext().writePage();
        writer.end();
    }

}