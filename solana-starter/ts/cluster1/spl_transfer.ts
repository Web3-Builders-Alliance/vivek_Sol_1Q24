import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../dev-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { connect } from "http2";


// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// We're going to import our keypair from the wallet file

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("DCwEiu1YvELe9MVinELVpoD1Jkzkdeiqrkjog124rYkC");

// Recipient address
const to = new PublicKey("FDfvzsukW6CXKo32bvjaY5A7cCWFnWQDzA9UetZuRgwb");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ata1 = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey) 

        // Get the token account of the toWallet address, and if it does not exist, create it
        const ata2 = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to)

        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await transfer(connection, keypair, ata1.address, ata2.address, keypair.publicKey, 1000000)
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
