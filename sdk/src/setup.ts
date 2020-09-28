
// This script generates an unpublished long-form DID, storing private keys in Azure Key Vault.
// You should only need to run this script once to generate your verifier's DID and its keys.
import * as config from '../client.json';

//////////////// Load DID packages
import { ClientSecretCredential } from '@azure/identity';
import { CryptoBuilder, 
      LongFormDid,
      KeyReference,
      KeyUse
    } from 'verifiablecredentials-verification-sdk-typescript';

///////////////// Setup the crypto class from the VC SDK
const kvCredentials = new ClientSecretCredential(config.tenantId, config.clientId, config.clientSecret);
const signingKeyReference = new KeyReference('verifier-signing-key', 'key');
const recoveryKeyReference = new KeyReference('verifier-recovery-key', 'key');
var crypto = new CryptoBuilder()
    .useSigningKeyReference(signingKeyReference)
    .useRecoveryKeyReference(recoveryKeyReference)
    .useKeyVault(kvCredentials, 'https://fabricamera.vault.azure.net/')
    .build();

(async () => {
    /////////////// Generate the necessary keys in Azure Key Vault, and generate a DID.
    crypto = await crypto.generateKey(KeyUse.Signature, 'signing');
    crypto = await crypto.generateKey(KeyUse.Signature, 'recovery');
    const did = await new LongFormDid(crypto).serialize();
    console.log(did);
})();