import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        //2. Convert image to generic file.
        //3. Upload image

        // const image = ???

        // const [myUri] = ??? 
        // console.log("Your image URI: ", myUri);
        const rugimage = await readFile("/home/vivek/WBA/vivek_Sol_1Q24/solana-starter/ts/cluster1/rugs/generug2.png")
        const image = createGenericFile (rugimage, 'generug.png')
        const [myUri] = await umi.uploader.upload([image])
       console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

