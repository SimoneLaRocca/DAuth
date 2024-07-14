import { ethers } from 'ethers';
import { agent, INFURA_PROJECT_ID, PRIVATE_KEY, DID_REGISTRY_ADDRESS } from './veramo/setup.js';
import * as fs from 'fs';

const provider = new ethers.providers.InfuraProvider('sepolia', INFURA_PROJECT_ID);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function registerIssuerDID() {
  const issuerDidData = JSON.parse(fs.readFileSync('issuer-did.json', 'utf8'));
  const didDocument = {
    id: issuerDidData.did,
    verificationMethod: [
      {
        id: `${issuerDidData.did}#controller`,
        type: 'EcdsaSecp256k1VerificationKey2019',
        controller: issuerDidData.did,
        publicKeyHex: issuerDidData.keys[0].publicKeyHex
      }
    ],
    authentication: [`${issuerDidData.did}#controller`],
    assertionMethod: [`${issuerDidData.did}#controller`]
  };

  console.log('Issuer DID Document:', didDocument);

  const ethrDid = new ethers.Contract(
    DID_REGISTRY_ADDRESS,
    [
      'function updateDIDDocument(string memory _did, bytes memory _document) public',
    ],
    wallet
  );

  const documentBytes = ethers.utils.toUtf8Bytes(JSON.stringify(didDocument));

  const tx = await ethrDid.updateDIDDocument(issuerDidData.did, documentBytes);
  const receipt = await tx.wait();

  console.log('Transaction hash:', receipt.transactionHash);
}

registerIssuerDID().catch(console.error);
