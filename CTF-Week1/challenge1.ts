import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { Week1, IDL } from "./programs/week1";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

import wallet from "./wallet/wba-wallet.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "finalized"});

// Create our program
const program = new Program<Week1>(IDL, "ctf1VWeMtgxa24zZevsXqDg6xvcMVy4FbP3cxLCpGha" as Address, provider);

// Use the PDA for our CTF-Week1 profile
const profilePda = PublicKey.findProgramAddressSync([Buffer.from("profile"), keypair.publicKey.toBuffer()], program.programId)[0];

// Paste here the mint address for challenge1 token
const mint = new PublicKey("GhQqNMr43Lri7MPZxBjyTnoPiQcPLsGNZRRWLpUgzTsT");

// Create the PDA for the Challenge1 Vault
const vault = PublicKey.findProgramAddressSync([Buffer.from("vault1"), keypair.publicKey.toBuffer(), mint.toBuffer()], program.programId)[0];

(async () => {
    try {

        // NB if you get TokenAccountNotFoundError, wait a few seconds and try again!

        // Create the ATA for your Wallet
        const ownerAta = getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
            
        );

        // Mint some tokens!
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            (await ownerAta).address, 
            keypair,
            100000
        )
        
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${mintTx}?cluster=devnet`);
        
        // Complete the Challenge!
        const completeTx = await program.methods
        .completeChallenge1(new BN(1))
        .accounts({
            owner: keypair.publicKey,
            ata: (await ownerAta).address,
            profile: profilePda,
            vault: vault,
            mint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId
        })
        .signers([
            keypair
        ]).rpc();

        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${completeTx}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();


// Success! Check out your TX here: 
//         https://explorer.solana.com/tx/2g2gQCytC5GqK4nkovW2XrqwcWGyCWrTLtxLqhMBMWL62dPBk4Tw7rCT9PMYdW42zL6HWa8nauvx2R5uZo2gHY3f?cluster=devnet
// Success! Check out your TX here: 
//         https://explorer.solana.com/tx/35wCRzgvCpgWnhc6wQYj9A2qhmrdcpPF3zsCbMxKGZQkRyhsPSdUbuVYVCcuiMsca8LMZC7a9SSUDqbAiCtJ9dob?cluster=devnet