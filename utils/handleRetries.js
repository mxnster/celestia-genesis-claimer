import { config } from "../config.js";

let retryMap = new Map();

export function handleRetries(address) {
    let maxRetries = config.retries;
    let count = retryMap.get(address) + 1 || 1;
    retryMap.set(address, count);

    return count < maxRetries
}
