
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export async function generateWallet(){
    let mnemonic = await DirectSecp256k1HdWallet.generate(12, { prefix: "celestia" })
    return mnemonic.secret.data
}