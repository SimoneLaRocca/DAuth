import { agent } from './veramo/setup.js'
import * as fs from 'fs'

async function main() {
  const issuerIdentifier = await agent.didManagerGetByAlias({ alias: 'issuer' })
  const clientIdentifier = await agent.didManagerGetByAlias({ alias: 'client' })

  const vc = await agent.createVerifiableCredential({
    credential: {
      issuer: { id: issuerIdentifier.did },
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'HealthCredential'],
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: clientIdentifier.did,
        name: 'Mario Rossi',
        dateOfBirth: '1990-01-01',
        healthID: 'RSSMRA90A01H703H',
        insuranceProvider: 'National Health Service',
      },
    },
    proofFormat: 'jwt',
  })

  console.log('New credential created')
  console.log(JSON.stringify(vc, null, 2))
  
  fs.writeFileSync('credential.json', JSON.stringify(vc, null, 2))

  console.log('New credential created and saved to credential.json')
}

main().catch(console.error)
