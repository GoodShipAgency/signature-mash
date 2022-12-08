"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const DigitallySignPdf_1 = require("../DigitallySignPdf");
const fs = require("fs");
const app_1 = require("../app");
const DigitalSignRequest = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    reason: typebox_1.Type.String(),
    location: typebox_1.Type.String(),
    contactInfo: typebox_1.Type.String(),
});
app_1.app.post("/sign/digital", { preHandler: app_1.upload.single('pdf') }, (req, res) => {
    const digitallySignPdf = new DigitallySignPdf_1.default();
    const output = digitallySignPdf.sign(req.file.buffer, fs.readFileSync('resource/keys/key.p12'), req.body.name, req.body.reason, req.body.location, req.body.contactInfo);
    res.code(200)
        .type('application/pdf')
        .send(output);
});
//# sourceMappingURL=digitalSign.js.map