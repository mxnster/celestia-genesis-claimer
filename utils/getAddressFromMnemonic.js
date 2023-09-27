import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export async function getAddressFromMnemonic(mnemonic) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'celestia' });
    const account = await wallet.getAccounts();
    return account[0].address;
}