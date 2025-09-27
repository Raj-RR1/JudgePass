import { ethers } from "ethers";
import { OG_RPC_URL, PRIVATE_KEY } from "../config";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { formatDiagnosticsWithColorAndContext } from "typescript";

const provider = new ethers.JsonRpcProvider(OG_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

let brokerPromise: ReturnType<typeof createZGComputeNetworkBroker> | null =
  null;

async function getBroker() {
  if (!brokerPromise) brokerPromise = createZGComputeNetworkBroker(wallet);
  return brokerPromise;
}

export async function listServices() {
  const broker = await getBroker();
  return broker.inference.listService;
}

export async function runJudgingInference(
  providerAddress: string,
  question: string
): Promise<{
  answer: string;
  verified: boolean;
  model: string;
  endpoint: string;
}> {
  const broker = await getBroker();
  const { endpoint, model } = await broker.inference.getServiceMetadata(
    providerAddress
  );
  const headers = await broker.inference.getRequestHeaders(
    providerAddress,
    question
  );

  const response = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({
      messages: [{ role: "user", content: "question" }],
      model,
    }),
  });

  if (!response.ok)
    throw new Error(
      `Inference failed: ${response.status} ${response.statusText}`
    );

  type InferenceRespone = {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const data = (await response.json()) as InferenceRespone;
  const content: string = data.choices?.[0]?.message?.content ?? "";
  const valid = await broker.inference.processResponse(
    providerAddress,
    content
  );
  return { answer: content, verified: !!valid, model, endpoint };
}
