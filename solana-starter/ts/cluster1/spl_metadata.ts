import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
//import { findProgramAddressSync } from ""
import base58  from "bs58";

// Define our Mint address
const mint = publicKey("DCwEiu1YvELe9MVinELVpoD1Jkzkdeiqrkjog124rYkC")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,
            
        }

        let data: DataV2Args = {
            name: "My NFT",
            symbol: "NFT",
            uri: "",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,                       
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi).then(r => r.signature.toString());
        console.log(result);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();