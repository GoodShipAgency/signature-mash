import {Static, Type} from "@sinclair/typebox";
import CertifyPdf from "../PdfCertifier";
import * as  fs from "fs";
import {app, upload} from "../app";


const CertifyRequest = Type.Object({
    name: Type.String(),
    reason: Type.String(),
    location: Type.String(),
    contactInfo: Type.String(),
});

type CertifyRequestType = Static<typeof CertifyRequest>;


app.post<{ Body: CertifyRequestType }>("/certify", {preHandler: upload.single('pdf')}, (req, res) => {
    const certifyPdf = new CertifyPdf();

    const output = certifyPdf.certify(
        req.file.buffer,
        fs.readFileSync('resource/keys/key.p12'),
        req.body.name,
        req.body.reason,
        req.body.location,
        req.body.contactInfo
    );

    res.code(200)
        .type('application/pdf')
        .send(output);
});