import axios from "axios";
import { solveCaptcha } from "./anticaptcha.js";
import { proxyAgent } from "../index.js";
import { timeout } from "./timeout.js";
import { handleRetries } from "./handleRetries.js";


export async function getChallenge(address) {
    try {
        console.log("Получаю сообщение для подписи");

        let challenge = await axios.get(`https://genesis-api.celestia.org/api/v1/metamask/challenge/${address}`, {
            httpsAgent: proxyAgent,
            params: {
                'Content-Type': 'application/json',
                'recaptcha_token': await solveCaptcha(),
            },
        })

        return challenge?.data;
    }
    catch (e) {
        if (e?.response?.data?.slug === 'recaptcha-verification') {
            console.log('[ERROR]', e.response.data.title);
        } else console.log('[ERROR]', e?.response?.statusText || e?.code || e);


        if (await handleRetries(address)) return await getChallenge(address)

        return e?.response?.data
    }
}