import { Indexer, ZgFile } from "@0glabs/0g-ts-sdk";
import { ethers, Wallet as EthersWallet } from "ethers";
import { INDEXER_RPC_URL, OG_RPC_URL, PRIVATE_KEY } from "../config";

const provider = new ethers.JsonRpcProvider(OG_RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const indexer = new Indexer(INDEXER_RPC_URL);

export async function uploadJsonToStorage(
  obj: unknown
): Promise<{ rootHash: string; txHash: string }> {
  const json = JSON.stringify(obj, null, 2);

  const tmpPath = `./tmp-score-${Date.now()}.json`;

  await Bun.write(tmpPath, json);

  const file = await ZgFile.fromFilePath(tmpPath);

  const [tree, treeErr] = await file.merkleTree();

  if (treeErr) {
    await file.close();
    await Bun.file(tmpPath).delete();
    throw new Error(`Merkle Tree Error: ${treeErr}`);
  }

  const [tx, uploadErr] = await indexer.upload(file, OG_RPC_URL, signer as any);

  if (!tx.rootHash || !tx.txHash) {
    throw new Error("Invalid tx object returned from indexer.upload");
  }

  await file.close();
  await Bun.file(tmpPath).delete();

  if (uploadErr) {
    throw new Error(`Upload error: ${uploadErr}`);
  }

  return { rootHash: tx.rootHash, txHash: tx.txHash };
}

export async function fetchEncryptedPayload(
  encryptedURI: string
): Promise<string> {
  if (/^https?:\/\//i.test(encryptedURI)) {
    const res = await fetch(encryptedURI);
    if (!res.ok) throw new Error(`Failed to fetch encryptedURI: ${res.status}`);
    const body = await res.text();
    return body.trim();
  }
  return encryptedURI;
}
