import {
  AptosClient,
  FaucetClient,
  TxnBuilderTypes,
  BCS,
  HexString,
  AptosAccount,
} from "aptos";
const nodeUrl = "https://fullnode.devnet.aptoslabs.com/v1";
const faucetUrl = "https://faucet.devnet.aptoslabs.com";
const client = new AptosClient(nodeUrl);
const faucetClient = new FaucetClient(nodeUrl, faucetUrl);

export async function buildTx(sender: AptosAccount, recipientAddress: string) {
  const payload = {
  type: "entry_function_payload",
  function: "0x1::coin::transfer",
  type_arguments: ["0x1::aptos_coin::AptosCoin"],
  arguments: [recipientAddress, 1_000_000], // 0.01 APT
};

  const txnRequest = await client.generateTransaction(
    sender.address(),
    payload
  );

  return txnRequest;
}

export async function signTx(sender: AptosAccount, txnRequest: any) {
  const signedTxn = await client.signTransaction(sender, txnRequest);
  return signedTxn;
}

export async function submitTx(signedTxn: Uint8Array) {
    const txResponse = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(txResponse.hash);
    console.log("Transaction submitted successfully:", txResponse.hash);
    return txResponse;
}

export async function main() {
  const sender = new AptosAccount();
  const recipientAddress = "0xa0c7b44330ff89e8b0408c1110f1fc4758cdb688c0d812b465554c9674cec7fc";
  await faucetClient.fundAccount(sender.address(), 100_000_000);

  const tx = await buildTx(sender, recipientAddress);
  const signedTxn = await signTx(sender, tx);
  const txResponse = await submitTx(signedTxn);
  console.log(`****************** : ${JSON.stringify(txResponse, null, 2)}`);

}

main().catch((error) => {
  console.error("Error in transaction process:", error);
});