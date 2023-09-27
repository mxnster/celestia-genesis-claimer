import { parseFile } from "./utils/parseFile.js";
import { getEligible } from "./utils/getEligble.js";
import { config } from "./config.js";
import { ethers } from "ethers";
import { handleClaim } from "./utils/handleClaim.js";
import fs from 'fs';


async function handleWallet(wallet) {
    if (config.claim) {
        return await handleClaim(wallet)
    }

    if (config.check) {
        let eligibleData = await getEligible(wallet);
        console.log(eligibleData?.title)
        if (eligibleData?.title === 'You are eligible') fs.appendFileSync("eligible.txt", `${wallet}\n`)
    }
}

async function main() {
    let wallets = parseFile("wallets.txt")
    fs.writeFileSync("eligible.txt", "");

    for (let i = 0; i < wallets.length; i++) {
        if (config.claim) {
            let wallet = new ethers.Wallet(wallets[i]);
            console.log(`[${i + 1}] ${wallet.address}`);
            await handleWallet(wallet);
        } else if (config.check) {
            let address = wallets[i];
            console.log(`[${i + 1}] ${address}`);
            await handleWallet(address);
        }
    }
}

main();