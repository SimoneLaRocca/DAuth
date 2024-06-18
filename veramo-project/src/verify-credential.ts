import { agent } from './veramo/setup.js'
import * as fs from 'fs'

async function main() {
  const vc = JSON.parse(fs.readFileSync('credential.json', 'utf8'))

  const result = await agent.verifyCredential({
    credential: vc,
  })

  console.log('Credential verified:', result.verified)

  fs.writeFileSync('verifiedCredential.json', JSON.stringify(result, null, 2))

  console.log('Credential saved to verifiedCredential.json')
}

main().catch(console.error)
