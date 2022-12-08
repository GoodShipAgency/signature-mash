import DigitallySignPdf from "./DigitallySignPdf.js";
import ElectronicallySignPdf from "./ElectronicallySignPdf.js";

import fastify from "fastify";
import multer from "fastify-multer";
import fs from "fs";

const app = fastify({logger: true});

const upload = multer({storage: multer.memoryStorage()});
app.register(multer.contentParser)

app.get('/', async (req, res) => {
    // build a form which allows you to upload a pdf
    const electronicSignForm = '<form method="post" action="/sign/electronic" enctype="multipart/form-data">' +
        '<input type="file" name="pdf" />' +
        '<input type="text" name="name" placeholder="Signee Name"/>' +
        '<input type="number" name="signatureIndex"/>' +
        '<input type="submit" value="Submit" />' + '</form>';

    // build a form which allows you to use the digital sign endpoint
    const digitalSignForm = '<form method="post" action="/sign/digital" enctype="multipart/form-data">' +
        '<input type="file" name="pdf" />' +
        '<input type="text" placeholder="Name" name="name" />' +
        '<input type="text" placeholder="Signing Reason" name="reason">' +
        '<input type="text" placeholder="Location" name="location">' +
        '<input type="text" placeholder="Contact Info" name="contactInfo">' +
        '<input type="submit" value="Submit" />' + '</form>';

    res.code(200)
        .type('text/html')
        .send('Server is online. Use POST /sign/electronic and POST /sign/digital endpoints to sign pdfs. <br>' + electronicSignForm + '<br>' + digitalSignForm);

});

app.post("/sign/electronic", {preHandler: upload.single('pdf')}, (req, res) => {
    const electronicallySignPdf = new ElectronicallySignPdf();

    const output = electronicallySignPdf.addElectronicSignature(
        req.file.buffer,
        req.body.name,
        req.body?.signatureIndex
    );

    res.code(200)
        .type('application/pdf')
        .send(output);
});

app.post("/sign/digital", {preHandler: upload.single('pdf')}, (req, res) => {
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

// start the server
app.listen({port: 3000});
