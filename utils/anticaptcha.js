import { config } from "../config.js";
import { handleRetries } from "./handleRetries.js";
import { timeout } from "./timeout.js";
import axios from "axios";

export async function solveCaptcha() {
    try {
        let res = await axios(`https://api.capsolver.com/createTask`, {
            method: "POST",
            data: {
                "clientKey": `${config.api_key}`,
                "task": {
                    "type": "RecaptchaV3TaskProxyless",
                    "websiteURL": 'https://genesis.celestia.org/',
                    "websiteKey": await getSiteKey(),
                    "pageAction": 'submit'
                },
                "softId": 0
            },
        })

        await timeout(3000)

        return await getCaptchaResponse(res.data.taskId)
    } catch (err) {
        console.log("Упс...Что-то пошло не так!. Пробую еще раз.");
        if (handleRetries) return await solveCaptcha()
    }
}

async function getCaptchaResponse(taskId) {
    try {
        let solution = '';

        while (!solution) {
            let res = await axios(`https://api.capsolver.com/getTaskResult`, {
                method: 'POST',
                data: {
                    "clientKey": `${config.api_key}`,
                    "taskId": taskId
                }
            })
            if (res?.data.status === "ready") {
                // console.log(`Captcha solved`);
                return res.data.solution.gRecaptchaResponse
            } else if (res?.data?.status === "processing") {
                console.log(`Captcha status: processing`);
                await timeout(5000)
            } else {
                console.log(res?.data?.errorDescription);
                return false
            }
        }
    } catch (e) {
        console.log("Не удалось получить решение капчи.");
    }
}


async function getSiteKey() {
    try {
        let res = await axios.get(`https://genesis-api.celestia.org/api/v1/recaptcha/client-key`)
        return res?.data
    } catch (err) {
        console.log('Не смог получить siteKey для антикапчи');
        await timeout(5000)
        return await getSiteKey()
    }
}