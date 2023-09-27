import axios from "axios";
import { solveCaptcha } from "./anticaptcha.js";


export async function getChallenge(address) {
    try {
        console.log("Получаю сообщение для подписи");
        let challenge = await axios.get(`https://genesis-api.celestia.org/api/v1/metamask/challenge/${address}`, {
            params: {
                'Content-Type': 'application/json',
                'recaptcha_token': await solveCaptcha(),
            },
        })
        return challenge?.data;
    }
    catch (err) { console.log(err); }
}