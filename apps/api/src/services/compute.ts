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
  // try {
  //   const broker = await getBroker();
  //   const services = await broker.inference.listService();
  //   return services || [];
  // } catch (error) {
  //   console.warn(
  //     "Failed to fetch services:",
  //     error instanceof Error ? error.message : String(error)
  //   );
  //   return [
  //     {
  //       model: "llama-3.3-70b-instruct",
  //       provider: "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
  //       verifiability: "TeeML",
  //     },
  //   ];
  // }
  //
  console.log("🎯 Using official 0G providers (bypassing network discovery)");

  const OFFICIAL_PROVIDERS = [
    {
      provider: "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
      serviceType: "inference",
      url: "",
      inputPrice: 0n,
      outputPrice: 0n,
      updatedAt: BigInt(Date.now()),
      model: "llama-3.3-70b-instruct",
      verifiability: "TeeML",
    },
    {
      provider: "0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3",
      serviceType: "inference",
      url: "",
      inputPrice: 0n,
      outputPrice: 0n,
      updatedAt: BigInt(Date.now()),
      model: "deepseek-r1-70b",
      verifiability: "TeeML",
    },
  ];

  return OFFICIAL_PROVIDERS;
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

  try {
    console.log("Checking account balance...");
    const account = await broker.ledger.getLedger();
    const balance = ethers.formatEther(account.totalBalance);
    console.log(`Account balance: ${balance} OG`);

    if (parseFloat(balance) < 0.001) {
      console.log("Adding funds to account...");
      await broker.ledger.addLedger(0.1);
      console.log("Funds added successfully");
    }
    console.log(`Acknowledging provider: ${providerAddress}`);
    try {
      await broker.inference.acknowledgeProviderSigner(providerAddress);
      console.log(`Provider acknowledged successfully`);
    } catch (ackError) {
      // Provider might already be acknowledged, continue
      console.log(
        `Provider acknowledgment: ${
          ackError instanceof Error ? ackError.message : String(ackError)
        }`
      );
    }
    console.log("Getting service metadata...");
    const { endpoint, model } = await broker.inference.getServiceMetadata(
      providerAddress
    );
    console.log(`Service metadata: ${model} at ${endpoint}`);

    console.log("Generating request headers...");
    const headers = await broker.inference.getRequestHeaders(
      providerAddress,
      question
    );

    console.log("Making AI request...");
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        messages: [{ role: "user", content: question }],
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
  } catch (error) {
    console.error(
      `Inference failed for ${providerAddress}:`,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}
