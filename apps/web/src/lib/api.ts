import { JudgeMetadata, Scorecard } from "../types";
import { WalletInfo } from "./walletSigner";

export async function fetchJudgeMetadata(
  tokenId: number,
  wallet: string
): Promise<{ metadata: JudgeMetadata }> {
  const res = await fetch(`/judge/${tokenId}/metadata?wallet=${wallet}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch metadata");
  }
  return res.json();
}

export async function listServices(): Promise<{ services: any[] }> {
  const res = await fetch(`/judge/services`);
  if (!res.ok) throw new Error("Failed to list services");
  return res.json();
}

export async function runJudge(
  tokenId: number,
  wallet: string,
  submissionId: string,
  text: string,
  walletInfo?: WalletInfo
): Promise<{ scorecard: Scorecard }> {
  const res = await fetch(`/judge/${tokenId}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, submissionId, text, walletInfo }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to run judge");
  }
  return res.json();
}

export async function uploadScorecard(
  tokenId: number,
  scorecard: Scorecard,
  walletInfo?: WalletInfo
): Promise<{ rootHash: string; txHash: string }> {
  const res = await fetch(`/judge/${tokenId}/scorecard/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scorecard, walletInfo }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to upload scorecard");
  }
  return res.json();
}