import { config } from "../config.js";
import { timeout } from "./timeout.js";

let retryMap = new Map();

export async function handleRetries(address) {
    await timeout(5000, 10000)
    let maxRetries = config.retries;
    let count = retryMap.get(address) + 1 || 1;
    retryMap.set(address, count);

    return count < maxRetries
}
