import { Commitment, Connection, Keypair, Transaction, sendAndConfirmTransaction, PublicKey, Signer } from "@solana/web3.js"
import wallet from "./wallet/wba-wallet.json"
import {createMetadataAccountV3, DataV2Args, CreateMetadataAccountV3InstructionAccounts, CreateMetadataAccountV3InstructionArgs } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { publicKey, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi';
import { publicKey as publicKeySerializer, string } from '@metaplex-foundation/umi/serializers';
import { base58 } from "@metaplex-foundation/umi/serializers";


//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

//Create a Umi instance
const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signerKeypair = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signerKeypair));

const mint =  publicKey('9QL7D7xdn1ztuEp7kjNpQVnRZAaWojqN2aJrXHhwdf6q')
const tokenMetadataProgramId = publicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

const seeds = 
  [string({ size: 'variable' }).serialize('metadata'),
  publicKeySerializer().serialize(tokenMetadataProgramId),
  publicKeySerializer().serialize(mint),
];
const metadata_pda = umi.eddsa.findPda(tokenMetadataProgramId, seeds);

(async () => {

  let accounts: CreateMetadataAccountV3InstructionAccounts = {
    mint: mint,
    mintAuthority: signerKeypair,
    payer: signerKeypair
}

  let data: DataV2Args = {
    name: "WBA",
    symbol: "WBA",
    uri: "",
    creators: [
      {
          address: keypair.publicKey,
          verified: true, 
          share: 100
      }
  ],
  sellerFeeBasisPoints: 0,
  collection: null,
  uses: null

  }

  let args: CreateMetadataAccountV3InstructionArgs = {
    data,
    isMutable: true,
    collectionDetails: null
}

    let tx = createMetadataAccountV3(
      umi,
      {
          ...accounts,
          ...args
      }
    );

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.deserialize(result.signature);

    console.log(`Succesfully Minted!. Transaction Here: https://solana.fm/tx/${signature[0]}?cluster=devnet`)
    
})();


// Succesfully Minted!. Transaction Here: https://solana.fm/tx/Mp8mr54gyVTVFGKDZH1Yrd1RC7McyzmuPVN6w9hWZin7kBhmSdmMFuZvi6AumPzvvACNazna6wPXLWQsjKVj9yk?cluster=devnet