import { getChallenge } from "./getChallenge.js";
import { authMM } from "./auth.js";
import fs from "fs";
import { getAddressFromMnemonic } from "./getAddressFromMnemonic.js";
import { generateWallet } from "./generateWallet.js";
import { getEligible } from "./getEligble.js";
import { claimTokens } from "./claimTokens.js";


export async function handleClaim(wallet) {
    try {
        let message = await getChallenge(wallet.address)
        let signature = await wallet.signMessage(message)
        let mnemonic = await generateWallet()
        let celAddress = await getAddressFromMnemonic(mnemonic);
        let authToken = await authMM(wallet, signature);
        let eligibleData = await getEligible(wallet.address, authToken);

        if (eligibleData?.slug === 'eligible') {
            console.log(`Клейм ${eligibleData.category.airdrop_amount} TIA на ${celAddress}`)
            fs.appendFileSync("celestiaMnemonics.txt", `${mnemonic}\n`)
            let isClaimed = await claimTokens(celAddress, authToken);
            console.log(isClaimed?.message);
        } else console.log(eligibleData?.title)
    } catch (e) {
        console.log(e);
    }
}