import { ethers } from 'ethers';
import { agent } from './veramo/setup.js';
import * as fs from 'fs';

const INFURA_PROJECT_ID = 'your_infuria_project_id';

const provider = new ethers.providers.InfuraProvider('sepolia', INFURA_PROJECT_ID);

const privateKey = 'your_private_key';
const wallet = new ethers.Wallet(privateKey, provider);

const didRegistryAddress = '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818';

async function registerIssuerDID() {
  // Load the DID document of the issuer from the issuer-did.json file
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
    didRegistryAddress,
    [
      'function setAttribute(address identity, bytes32 name, bytes value, uint validity) public',
    ],
    wallet
  );

  const attributeName = ethers.utils.formatBytes32String('did/doc');
  const attributeValue = ethers.utils.toUtf8Bytes(JSON.stringify(didDocument));
  const validity = 86400; // 1 day validity

  const tx = await ethrDid.setAttribute(wallet.address, attributeName, attributeValue, validity);
  const receipt = await tx.wait();

  console.log('Transaction hash:', receipt.transactionHash);
}

registerIssuerDID().catch(console.error);
