import { JudgeMetadata, Scorecard } from "../types";

// --- MOCK DATA ---
const mockMetadata: JudgeMetadata = {
  version: "Mock Judge v1.0",
  rubric: [
    { criterion: "Clarity", weight: 0.4 },
    { criterion: "Technical Accuracy", weight: 0.6 },
  ],
  prompts: { system: "You are a helpful AI.", userTemplate: "" },
};

const mockScorecard: Scorecard = {
  tokenId: 1,
  submissionId: "sub-001",
  scores: [
    { criterion: "Clarity", score: 4, weight: 0.4 },
    { criterion: "Technical Accuracy", score: 5, weight: 0.6 },
  ],
  totalWeightedScore: 4 * 0.4 + 5 * 0.6,
  justification:
    "This is a mock justification. The submission was clear and technically sound.",
  provider: "mock-provider-address",
  model: "mock-model-v1",
  verified: true,
  createdAt: Date.now(),
};
// --- END MOCK DATA ---

const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchJudgeMetadata(
  tokenId: number,
  wallet: string
): Promise<{ metadata: JudgeMetadata }> {
  console.log(
    " MOCK API: Fetching metadata for token",
    tokenId,
    "and wallet",
    wallet
  );
  await simulateDelay(1000);
  if (tokenId !== 1) {
    // Simulate an error for any token ID other than 1
    throw new Error("Mock Error: INFT with this Token ID not found.");
  }
  return { metadata: mockMetadata };
}

export async function runJudge(
  tokenId: number,
  wallet: string,
  submissionId: string,
  text: string
): Promise<{ scorecard: Scorecard }> {
  console.log(" MOCK API: Running judge for submission", submissionId);
  await simulateDelay(2500);
  if (text.toLowerCase().includes("fail")) {
    // Simulate an error
    throw new Error("Mock Error: Inference failed due to content.");
  }
  return {
    scorecard: {
      ...mockScorecard,
      tokenId,
      submissionId,
      createdAt: Date.now(),
    },
  };
}

export async function uploadScorecard(
  tokenId: number,
  scorecard: Scorecard
): Promise<{ rootHash: string; txHash: string }> {
  console.log(" MOCK API: Uploading scorecard for token", tokenId);
  await simulateDelay(1500);
  return {
    rootHash: `0x_mock_root_hash_${Math.random().toString(36).substring(2)}`,
    txHash: `0x_mock_tx_hash_${Math.random().toString(36).substring(2)}`,
  };
}
