"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
app_1.app.get('/', async (req, res) => {
    const electronicSignForm = '<form method="post" action="/sign/electronic" enctype="multipart/form-data">' +
        '<input type="file" name="pdf" />' +
        '<input type="text" name="name" placeholder="Signee Name"/>' +
        '<input type="number" name="signatureIndex"/>' +
        '<input type="submit" value="Submit" />' + '</form>';
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
//# sourceMappingURL=index.js.map