import {app} from "../app";

app.get('/', async (req, res) => {
    const signForm = '<form method="post" action="/sign" enctype="multipart/form-data">' +
        '<input type="file" name="pdf" />' +
        '<input type="text" name="name" placeholder="Signee Name"/>' +
        '<input type="number" name="x"/>' +
        '<input type="number" name="y"/>' +
        '<input type="number" name="size" placeholder="Optional font size"/>' +
        '<input type="submit" value="Submit" />' + '</form>';

    const certifyForm = '<form method="post" action="/certify" enctype="multipart/form-data">' +
        '<input type="file" name="pdf" />' +
        '<input type="text" placeholder="Name" name="name" />' +
        '<input type="text" placeholder="Signing Reason" name="reason">' +
        '<input type="text" placeholder="Location" name="location">' +
        '<input type="text" placeholder="Contact Info" name="contactInfo">' +
        '<input type="submit" value="Submit" />' + '</form>';

    res.code(200)
        .type('text/html')
        .send('Server is online. Use POST /sign and POST /certify endpoints to sign pdfs. <br>' + signForm + '<br>' + certifyForm);
});