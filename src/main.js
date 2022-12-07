import DigitallySignPdf from "./DigitallySignPdf.js";
import ElectronicallySignPdf from "./ElectronicallySignPdf.js";

import fastify from "fastify";
import multer from "fastify-multer";

const app = fastify();

const upload = multer({storage: multer.memoryStorage()});
app.register(multer.contentParser)

app.get('/', async (req, res) => {
    // build a form which allows you to upload a pdf
    const form = '<form method="post" action="/sign/electronic" enctype="multipart/form-data">' + '<input type="file" name="pdf" />' + '<input type="submit" value="Submit" />' + '</form>';

    res.code(200)
        .type('text/html')
        .send('Server is online. Use POST /sign/electronic and POST /sign/digital endpoints to sign pdfs.' + form);

});

app.post("/sign/electronic", { preHandler: upload.single('pdf') }, (req, res) => {
    const electronicallySignPdf = new ElectronicallySignPdf();
    console.log(req.file);
    res.code(200)
        .type('application/pdf')
        .send(req.file.buffer);
});

// start the server
app.listen({port: 3000});
