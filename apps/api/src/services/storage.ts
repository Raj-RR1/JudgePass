import { Indexer, ZgFile } from "@0glabs/0g-ts-sdk";
import { ethers, Wallet as EthersWallet } from "ethers";
import { INDEXER_RPC_URL, OG_RPC_URL, PRIVATE_KEY } from "../config";

const provider = new ethers.JsonRpcProvider(OG_RPC_URL);
const fallbackSigner = new ethers.Wallet(PRIVATE_KEY, provider);
const indexer = new Indexer(INDEXER_RPC_URL);

export async function uploadJsonToStorage(
  obj: unknown,
  userSigner?: ethers.Wallet
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

  // Use user signer if provided, otherwise fall back to private key signer
  const signerToUse = userSigner || fallbackSigner;
  
  console.log("📤 Uploading to 0G storage...");
  console.log("🔗 Using RPC:", OG_RPC_URL);
  console.log("👤 Using signer:", signerToUse.address);
  console.log("📊 File size:", json.length, "bytes");
  
  const [tx, uploadErr] = await indexer.upload(file, OG_RPC_URL, signerToUse as any);

  if (uploadErr) {
    console.error("❌ Upload error details:", uploadErr);
    throw new Error(`Upload error: ${uploadErr}`);
  }

  if (!tx.rootHash || !tx.txHash) {
    console.error("❌ Invalid tx object:", tx);
    throw new Error("Invalid tx object returned from indexer.upload");
  }
  
  console.log("✅ Upload successful!");
  console.log("🔍 Root hash:", tx.rootHash);
  console.log("🔗 Transaction hash:", tx.txHash);

  await file.close();
  await Bun.file(tmpPath).delete();

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
  
  // If it's a hash (starts with 0x), this means the contract is storing a hash
  // instead of the actual encrypted data. This is a contract configuration issue.
  if (/^0x[a-fA-F0-9]{64}$/.test(encryptedURI)) {
    throw new Error(`Contract is storing a hash (${encryptedURI}) instead of encrypted metadata. The contract needs to be updated to store the actual encrypted data in the encryptedURI field.`);
  }
  
  // If it's not a URL or hash, assume it's the encrypted data directly
  return encryptedURI;
}
