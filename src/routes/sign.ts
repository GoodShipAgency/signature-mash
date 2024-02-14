import {Static, Type} from "@sinclair/typebox";
import {FilesInRequest} from "fastify-multer/typings/fastify";
import PdfSigner from "../PdfSigner";
import {FastifyReply} from "fastify";
import {app, upload} from "../app";

const SignRequestItem = Type.Object({
    value: Type.String(),
    x: Type.Number(),
    y: Type.Number(),
    size: Type.Optional(Type.Number()),
});

const SignRequest = Type.Object({
    text: Type.Array(SignRequestItem),
})

type SignRequestType = Static<typeof SignRequest> & FilesInRequest;

app.post<{ Body: SignRequestType }>("/sign", {preHandler: upload.single('pdf')}, (req, res: FastifyReply) => {
    const signPdf = new PdfSigner();

    let pdfContents = req.file.buffer;

    req.body.text.forEach((item) => {
        pdfContents = signPdf.addText(
            pdfContents,
            item.value,
            item.x,
            item.y,
            item.size ?? 18
        );
    })

    res.code(200)
        .type('application/pdf')
        .send(pdfContents);
});
