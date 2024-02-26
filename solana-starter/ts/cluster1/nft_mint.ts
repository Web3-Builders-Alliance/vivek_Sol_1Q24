import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata, CreateV1InstructionDataArgs, isNonFungible , CreateV1InstructionAccounts} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../dev-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = await createNft(umi, {
        mint,
        name: "My First NFT",
        uri: "https://arweave.net/zjwTIeSuKPWHu7UWToEYU8kF3TIZ2rLh0zMHb_TiG2A",
        sellerFeeBasisPoints: percentAmount(5),
    })
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();

// https://explorer.solana.com/tx/3Cxtq5ZvHteK4n4YGPn2DL255RUGySASMSvEL53S8QpqMCQY925hunrECquFZpKJqcufYfSB6dodos1e6VYzwKCc?cluster=devnet
// Mint Address:  9xMaHZTBsKbwupi9eGcHg2aoB97bBsrTrdGYSuXsMzy7

// https://explorer.solana.com/tx/5JUzCsRSG86Atf2TMPseRTpTBDqiSbuor4NuYjkXWQf9VgZ3XGmuLqpr5GF8md3xAkSNdzxNCaBfEYukby51GGYG?cluster=devnet
// Mint Address:  9KswXGoUh9wC3sMEhYdJmuGScohT7UPdRXjj8tUgXyH1
