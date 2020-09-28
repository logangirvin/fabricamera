import { ClientSecretCredential } from '@azure/identity';
import { CryptoBuilder, 
      RequestorBuilder, 
      KeyReference,
      IRequestor
    } from 'verifiablecredentials-verification-sdk-typescript';
import * as crypto from 'crypto';
import getjson from './getJson';
const config = getjson('client.json');
const did = getjson('did.json');

const kvCredentials = new ClientSecretCredential(config.tenantId, config.clientId, config.clientSecret);
const signingKeyReference = new KeyReference('verifier-signing-key', 'key');
const recoveryKeyReference = new KeyReference('verifier-recovery-key', 'key');
var builder = new CryptoBuilder()
    .useSigningKeyReference(signingKeyReference)
    .useRecoveryKeyReference(recoveryKeyReference)
    .useKeyVault(kvCredentials, 'https://fabricamera.vault.azure.net/')
    .useDid(did.did)
    .build();

const requestBuilder = new RequestorBuilder({
    clientName: "Fabricamera",
    clientId: 'https://localhost/presentation-response',
    redirectUri: 'https://localhost/presentation-response',
    logoUri: 'https://localhost/images/icon.png',
    tosUri: 'https://localhost/terms',
    clientPurpose: 'Apply for a Camera today!',
    presentationDefinition: {
        input_descriptors: [{
            id: "Contoso University Gradute",
            schema: {
                uri: ['https://schemas.contoso.edu/credentials/schemas/diploma2020'],
                name: "Contoso University Gradute",
            },
            issuance: [{
                manifest: 'https://portableidentitycards.azure-api.net/v1.0/9c59be8b-bd18-45d9-b9d9-082bc07c094f/portableIdentities/contracts/Diploma2020'
            }]
        }]
    }
} as IRequestor, builder).useNonce(crypto.randomBytes(32).toString('base64'))
    .useState('');

requestBuilder.build().create().then((presentationRequest) => {
    if (presentationRequest.result) {
        console.log(presentationRequest.request);
    } else {
        console.error(presentationRequest.detailedError);
    }
});