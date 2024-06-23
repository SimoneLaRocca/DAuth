import express, { Request, Response } from 'express';
import * as fs from 'fs';

const app = express();
const port = 3000;

app.get('/veramo', async (req: Request, res: Response) => {
    try {
        const did = req.query.did as string;
        if (!did) {
            res.status(400).send({ error: 'Missing DID' });
            return;
        }
        const vcData = JSON.parse(fs.readFileSync('verifiedCredential.json', 'utf8'));
        const vc = vcData.payload.sub;

        if (!vc) {
            res.status(404).send({ error: 'VC not found for DID' });
            return;
        }

        const vcString = JSON.stringify(vcData);
        res.status(200).send(vcString);
    } catch (error) {
        console.error('Error fetching VC:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Veramo adapter listening at http://localhost:${port}`);
});

