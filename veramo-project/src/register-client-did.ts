import { ethers } from 'ethers';
import { agent } from './veramo/setup.js';
import * as fs from 'fs'

const INFURA_PROJECT_ID = 'your_infuria_project_id';

const provider = new ethers.providers.InfuraProvider('sepolia', INFURA_PROJECT_ID);

const privateKey = 'your_private_key';
const wallet = new ethers.Wallet(privateKey, provider);

const didRegistryAddress = '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818';

async function registerDID() {
  const vcData = JSON.parse(fs.readFileSync('verifiedCredential.json', 'utf8'));
  const didDocument = vcData.didResolutionResult.didDocument;
  const did = didDocument.id;

  console.log('DID Document:', didDocument);

  const ethrDid = new ethers.Contract(
    didRegistryAddress,
    [
      'function setAttribute(address identity, bytes32 name, bytes value, uint validity) public',
    ],
    wallet
  );

  const attributeName = ethers.utils.formatBytes32String('did/doc');
  const attributeValue = ethers.utils.toUtf8Bytes(JSON.stringify(didDocument));
  const validity = 86400; 

  const tx = await ethrDid.setAttribute(wallet.address, attributeName, attributeValue, validity);
  const receipt = await tx.wait();

  console.log('Transaction hash:', receipt.transactionHash);
}

registerDID().catch(console.error);
