Veramo configuration:

yarn init -y

yarn add typescript ts-node --dev

yarn add @veramo/core @veramo/credential-w3c @veramo/data-store @veramo/did-manager @veramo/did-provider-ethr @veramo/did-resolver @veramo/key-manager @veramo/kms-local ethr-did-resolver web-did-resolver did-resolver ethers@5

yarn add sqlite3 typeorm

npx @veramo/cli config create-secret-key

yarn add express body-parser

yarn add @types/express --dev

yarn build

node ./dist/list-identifiers.js 

node ./dist/create-client-did.js 

node ./dist/create-issuer-did.js 

node ./dist/create-credential.js 

node ./dist/verify-credential.js 

node ./dist/register-client-did.js

node ./dist/register-issuer-did.js

node ./dist/adapter.js

