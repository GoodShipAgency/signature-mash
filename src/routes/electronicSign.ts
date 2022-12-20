import {Static, Type} from "@sinclair/typebox";
import {FilesInRequest} from "fastify-multer/typings/fastify";
import ElectronicallySignPdf from "../ElectronicallySignPdf";
import {FastifyReply} from "fastify";
import {app, upload} from "../app";

const ElectronicSignRequest = Type.Object({
    name: Type.String(),
    x: Type.Number(),
    y: Type.Number(),
    size: Type.Optional(Type.Number()),
});

type ElectronicSignRequestType = Static<typeof ElectronicSignRequest> & FilesInRequest;

app.post<{ Body: ElectronicSignRequestType }>("/sign/electronic", {preHandler: upload.single('pdf')}, (req, res: FastifyReply) => {
    const electronicallySignPdf = new ElectronicallySignPdf();

    const output = electronicallySignPdf.addElectronicSignature(
        req.file.buffer,
        req.body.name,
        req.body.x,
        req.body.y,
        req.body.size ?? 18
    );

    res.code(200)
        .type('application/pdf')
        .send(output);
});
