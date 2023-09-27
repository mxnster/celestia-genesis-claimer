import { generateRandomAmount } from "./generateRandomAmount.js";

export const timeout = (msFrom, msTo = msFrom) => new Promise(res => setTimeout(res, generateRandomAmount(msFrom, msTo)));  