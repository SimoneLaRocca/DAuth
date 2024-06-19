const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/veramo', (req, res) => {
    const did = req.query.did;

    try {
        let vcContent = {};

        if (did === 'your_issuer_did') {
            const issuerDidJson = fs.readFileSync('issuer-did.json', 'utf8');
            vcContent = JSON.parse(issuerDidJson);
        } else if (did === 'your_client_did') {
            const verifiedCredentialJson = fs.readFileSync('verifiedCredential.json', 'utf8');
            vcContent = JSON.parse(verifiedCredentialJson);
        } else {
            res.status(404).json({ message: 'DID not found' });
            return;
        }

        res.status(200).json(vcContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Veramo external adapter running on http://localhost:${port}`);
});
