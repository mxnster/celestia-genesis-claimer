import axios from "axios";
import { solveCaptcha } from "./anticaptcha.js";
import { proxyAgent } from "../index.js";
import { timeout } from "./timeout.js";
import { handleRetries } from "./handleRetries.js";


export async function authMM(wallet, signature) {
    try {
        console.log("Прохожу авторизацию");

        const response = await axios(`https://genesis-api.celestia.org/api/v1/metamask/auth`, {
            method: "POST",
            httpsAgent: proxyAgent,
            data: {
                'address': wallet.address,
                'headers': { 'Content-Type': 'application/json' },
                'recaptcha_token': await solveCaptcha(),
                'withCredentials': false,
                'signature': signature
            },
            headers: {
                'authority': 'genesis-api.celestia.org',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7',
                'origin': 'https://genesis.celestia.org',
                'referer': 'https://genesis.celestia.org/',
                'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
            }
        });

        return response?.data?.token
    } catch (e) {
        if (e?.response?.data?.slug === 'recaptcha-verification') {
            console.log('[ERROR]', e.response.data.title);
        } else console.log('[ERROR]', e?.response?.statusText || e?.code || e);

        await timeout(5000, 8000)

        if (await handleRetries(wallet.address)) {
            return await authMM(wallet, signature)
        }

        return e?.response?.data
    }
}