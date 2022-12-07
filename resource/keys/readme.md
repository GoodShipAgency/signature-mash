https://stackoverflow.com/questions/68832952/need-a-little-help-to-generate-p12-cert



Openssl has the pkcs12 command for adding certificates in the PKCS#12 format.

You could try something like this to simulate the whole flow (although you might already have certificates to import in the pkcs12 bundle)

Generate the certificate (only for this example)

How to generate a self-signed SSL Certificate using OpenSSL

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

This should create 2 files, key.pem with the private key and a cert.pem with the x509v2 certificate (note this command produces x509v2 certs which are kind of old and should not be used. since the motive of this answer is not to show how to generate valid certificates, I am using this dummy example)

Add the above key and cert to your pkcs12 bundle

openssl pkcs12 -in cert.pem -inkey key.pem -out foo.p12 -export -name friendly_name

Both the steps are going to ask for the private key password and the pkcs12 container password, keep a track of those passwords.

Verify that the cert has been stored

openssl pkcs12 -in foo.p12 -nokeys -info

This should print out something like

MAC Iteration 2048
MAC verified OK
PKCS7 Encrypted data: pbeWithSHA1And40BitRC2-CBC, Iteration 2048
Certificate bag
Bag Attributes
    localKeyID: 7E D3 2E ED 1A 3A 67 1E 90 4A AD 15 8D D9 C6 7A 11 EE E6 0A
    friendlyName: friendly_name
subject=/C=IN/ST=KA/CN=foo.example.com
issuer=/C=IN/ST=KA/CN=foo.example.com
-----BEGIN CERTIFICATE-----
MIIE5DCCAswCCQC/nYhnwGT1HzANBgkqhkiG9w0BAQsFADA0MQswCQYDVQQGEwJJ
    ---SNIPPED---
MkvKFwTL+ZQ=
-----END CERTIFICATE-----
PKCS7 Data
Shrouded Keybag: pbeWithSHA1And3-KeyTripleDES-CBC, Iteration 2048

Notice the friendly name in the output.

# Passphrase used: 1234