"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const ElectronicallySignPdf_1 = require("../ElectronicallySignPdf");
const app_1 = require("../app");
const ElectronicSignRequest = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    signatureIndex: typebox_1.Type.Number(),
});
app_1.app.post("/sign/electronic", { preHandler: app_1.upload.single('pdf') }, (req, res) => {
    const electronicallySignPdf = new ElectronicallySignPdf_1.default();
    const output = electronicallySignPdf.addElectronicSignature(req.file.buffer, req.body.name, req.body.signatureIndex);
    res.code(200)
        .type('application/pdf')
        .send(output);
});
//# sourceMappingURL=electronicSign.js.map