import {Static, Type} from "@sinclair/typebox";
import {FilesInRequest} from "fastify-multer/typings/fastify";
import PdfSigner from "../PdfSigner";
import {FastifyReply} from "fastify";
import {app, upload} from "../app";

const SignRequest = Type.Object({
    name: Type.String(),
    x: Type.Number(),
    y: Type.Number(),
    size: Type.Optional(Type.Number()),
});

type SignRequestType = Static<typeof SignRequest> & FilesInRequest;

app.post<{ Body: SignRequestType }>("/sign", {preHandler: upload.single('pdf')}, (req, res: FastifyReply) => {
    const signPdf = new PdfSigner();

    const output = signPdf.addSignature(
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
