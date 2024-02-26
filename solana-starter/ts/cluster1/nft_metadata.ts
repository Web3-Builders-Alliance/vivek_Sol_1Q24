import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"

import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = (umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://arweave.net/cFPs5GZcwytXgZhpTtCf8afgbd06FmcdjcjPPdzSuuI"
        const metadata = {
            name: "My Second NFT",
            symbol: "MSN",
            description: "This is my second NFT. I made it with Metaplex!",
            image: image,
            attributes: [
                {trait_type: 'Rug', value: 'yes'},
                {trait_type: 'Size', value: 'Large'},
                {trait_type: 'Material', value: 'Wool'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            // creators: []
        };
        const myUri = await umi.uploader.uploadJson([metadata]);
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();