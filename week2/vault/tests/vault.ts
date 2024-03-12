import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../target/types/vault";
import { PublicKey } from "@solana/web3.js";
import {createHash} from "crypto";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

describe("vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const program = anchor.workspace.Vault as Program<Vault>;

  const site = "vivekjami.com";

  const hash = createHash('sha256');

  hash.update(Buffer.from(site));

  const seeds = [hash.digest()];

  const vote = PublicKey.findProgramAddressSync(seeds, program.programId)[0];

  it("Initialize", async () => {
    const tx = await program.methods
      .initialize(site)
      .accounts({
        signer: provider.publicKey,
        vote
      })
      .rpc();
    console.log("Your transaction signature: ", tx);
    const account = await program.account.voteState.fetch(vote);
    console.log("On chain data: ", account.score.toString());
  });

  it("Upvote", async () => {
    const tx = await program.methods
      .upvote(site)
      .accounts({
        signer: provider.publicKey,
        vote
      })
      .rpc();
    console.log("Your transaction signature: ", tx);
    let account = await program.account.voteState.fetch(vote);
    console.log("On chain data: ", account.score.toString());

    const tx2 = await program.methods
      .upvote(site)
      .accounts({
        signer: provider.publicKey,
        vote
      })
      .rpc();
    console.log("Your transaction signature: ", tx2);
    account = await program.account.voteState.fetch(vote);
    console.log("On chain data: ", account.score.toString());

    const tx3 = await program.methods
      .upvote(site)
      .accounts({
        signer: provider.publicKey,
        vote
      })
      .rpc();
    console.log("Your transaction signature: ", tx3);
    account = await program.account.voteState.fetch(vote);
    console.log("On chain data: ", account.score.toString());
  })

  it("Downvote", async () => {
    // Add your test here.
    const tx = await program.methods
      .downvote(site)
      .accounts({
        signer: provider.publicKey,
        vote
      })
      .rpc();
    console.log("Your transaction signature: ", tx);
    const account = await program.account.voteState.fetch(vote);
    console.log("On chain data: ", account.score.toString());
  })
});