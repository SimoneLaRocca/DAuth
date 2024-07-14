import { ethers } from 'ethers';
import { agent, INFURA_PROJECT_ID, PRIVATE_KEY, DID_REGISTRY_ADDRESS } from './veramo/setup.js';
import * as fs from 'fs';

const provider = new ethers.providers.InfuraProvider('sepolia', INFURA_PROJECT_ID);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function registerDID() {
  const vcData = JSON.parse(fs.readFileSync('verifiedCredential.json', 'utf8'));
  const didDocument = vcData.didResolutionResult.didDocument;
  const did = didDocument.id;

  console.log('DID Document:', didDocument);

  const ethrDid = new ethers.Contract(
    DID_REGISTRY_ADDRESS,
    [
      'function updateDIDDocument(string memory _did, bytes memory _document) public',
    ],
    wallet
  );

  const documentBytes = ethers.utils.toUtf8Bytes(JSON.stringify(didDocument));

  const tx = await ethrDid.updateDIDDocument(did, documentBytes);
  const receipt = await tx.wait();

  console.log('Transaction hash:', receipt.transactionHash);
}

registerDID().catch(console.error);

