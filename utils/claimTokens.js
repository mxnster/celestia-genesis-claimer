import axios from "axios"
import { handleRetries } from "./handleRetries.js";
import { solveCaptcha } from "./anticaptcha.js";

export async function claimTokens(celAddress, authToken) {
    try {
        let response = await axios('https://genesis-api.celestia.org/api/v1/airdrop/claim', {
            method: "POST",
            data: {
                'address': celAddress,
                'recaptcha_token': await solveCaptcha(),
                'withCredentials': false,
            },
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'authority': 'genesis-api.celestia.org',
                'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'dnt': '1',
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

        return response?.data
    } catch (e) {
        console.log(e);
        if (handleRetries) return await claimTokens(celAddress, authToken)
        return false
    }
}