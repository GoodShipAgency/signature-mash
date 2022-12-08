"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_signpdf_1 = require("node-signpdf");
const index_js_1 = require("node-signpdf/dist/helpers/index.js");
class DigitallySignPdf {
    sign(pdfBuffer, p12Buffer, name, reason, location, contactInfo) {
        const signer = new node_signpdf_1.SignPdf();
        pdfBuffer = (0, index_js_1.plainAddPlaceholder)({
            pdfBuffer,
            reason,
            name,
            location,
            contactInfo,
        });
        return signer.sign(pdfBuffer, p12Buffer, { passphrase: '1234' });
    }
}
exports.default = DigitallySignPdf;
//# sourceMappingURL=DigitallySignPdf.js.map