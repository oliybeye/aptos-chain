import { AptosAccount } from "aptos";

const account = new AptosAccount();

console.log("Aptos Account Address:", account.address().hex());
console.log("Aptos Account Private Key:", Buffer.from(account.signingKey.secretKey).toString("hex"));

