import { parseFile } from "./utils/parseFile.js";
import { getEligible } from "./utils/getEligble.js";
import { config } from "./config.js";
import { ethers } from "ethers";
import { handleClaim } from "./utils/handleClaim.js";
import { HttpsProxyAgent } from "https-proxy-agent"
import fs from 'fs';

export let proxyAgent = null;

async function handleWallet(wallet) {
    if (config.claim) {
        return await handleClaim(wallet)
    }

    if (config.check) {
        let eligibleData = await getEligible(wallet);
        eligibleData && console.log(eligibleData?.title || eligibleData)
        if (eligibleData?.title === 'You are eligible') fs.appendFileSync("eligible.txt", `${wallet}\n`)
    }
}

async function main() {
    let wallets = parseFile("wallets.txt")
    fs.writeFileSync("eligible.txt", "");

    for (let i = 0; i < wallets.length; i++) {
        if (config.proxy) {
            const [ip, port, login, password] = config.proxy.split(":");
            const proxyString = `http://${login}:${password}@${ip}:${port}`;
            proxyAgent = new HttpsProxyAgent(proxyString)
        }

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