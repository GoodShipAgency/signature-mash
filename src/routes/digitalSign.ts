import {Static, Type} from "@sinclair/typebox";
import {FilesInRequest} from "fastify-multer/typings/fastify";
import DigitallySignPdf from "../DigitallySignPdf";
import * as  fs from "fs";
import {app, upload} from "../app";


const DigitalSignRequest = Type.Object({
    name: Type.String(),
    reason: Type.String(),
    location: Type.String(),
    contactInfo: Type.String(),
});

type DigitalSignRequestType = Static<typeof DigitalSignRequest>;


app.post<{ Body: DigitalSignRequestType }>("/sign/digital", {preHandler: upload.single('pdf')}, (req, res) => {
    const digitallySignPdf = new DigitallySignPdf();

    const output = digitallySignPdf.sign(
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