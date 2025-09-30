import { ethers } from "ethers";
import { OG_RPC_URL, PRIVATE_KEY } from "../config";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { formatDiagnosticsWithColorAndContext } from "typescript";

const provider = new ethers.JsonRpcProvider(OG_RPC_URL);
const fallbackWallet = new ethers.Wallet(PRIVATE_KEY, provider);

let brokerPromise: ReturnType<typeof createZGComputeNetworkBroker> | null =
  null;

async function getBroker(userWallet?: ethers.Wallet) {
  const walletToUse = userWallet || fallbackWallet;
  if (!brokerPromise) {
    console.log("🔧 Creating 0G broker...");
    brokerPromise = createZGComputeNetworkBroker(walletToUse);
  }
  return await brokerPromise;
}

export async function listServices(userWallet?: ethers.Wallet) {
  try {
    console.log("🔍 Discovering 0G services...");
    const broker = await getBroker(userWallet);
    const services = await broker.inference.listService();
    console.log(`✅ Found ${services.length} services from 0G network`);
    return services || [];
  } catch (error) {
    console.warn(
      "⚠️ Failed to fetch services from 0G network:",
      error instanceof Error ? error.message : String(error)
    );
    console.log("🎯 Using official 0G providers as fallback");

    // Fallback to official providers from documentation
    const OFFICIAL_PROVIDERS = [
      {
        provider: "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
        serviceType: "inference",
        url: "",
        inputPrice: 0n,
        outputPrice: 0n,
        updatedAt: BigInt(Date.now()),
        model: "gpt-oss-120b",
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
}

export async function runJudgingInference(
  providerAddress: string,
  question: string,
  userWallet?: ethers.Wallet
): Promise<{
  answer: string;
  verified: boolean;
  model: string;
  endpoint: string;
}> {
  const broker = await getBroker(userWallet);

  try {
    console.log("🔍 Checking account balance...");
    let account;
    try {
      account = await broker.ledger.getLedger();
      const balance = ethers.formatEther(account.totalBalance);
      console.log(`💰 Account balance: ${balance} OG`);

      if (parseFloat(balance) < 0.001) {
        console.log("💳 Adding funds to account...");
        try {
          await broker.ledger.depositFund(0.1);
          console.log("✅ Funds added successfully");
        } catch (fundError) {
          console.log("⚠️ Deposit failed, trying addLedger...");
          await broker.ledger.addLedger(0.1);
          console.log("✅ Funds added via addLedger");
        }
      }
    } catch (ledgerError) {
      console.log("⚠️ Ledger not found, 0G compute network may be unavailable");
      throw new Error("0G compute network is currently unavailable. Please try again later.");
    }

    console.log(`🤝 Acknowledging provider: ${providerAddress}`);
    try {
      await broker.inference.acknowledgeProviderSigner(providerAddress);
      console.log(`✅ Provider acknowledged successfully`);
    } catch (ackError) {
      // Provider might already be acknowledged, continue
      console.log(
        `⚠️ Provider acknowledgment: ${
          ackError instanceof Error ? ackError.message : String(ackError)
        }`
      );
    }

    console.log("📋 Getting service metadata...");
    const { endpoint, model } = await broker.inference.getServiceMetadata(
      providerAddress
    );
    console.log(`🔗 Service metadata: ${model} at ${endpoint}`);

    // Prepare messages array
    const messages = [{ role: "user", content: question }];
    
    console.log("🔐 Generating request headers...");
    const headers = await broker.inference.getRequestHeaders(
      providerAddress,
      JSON.stringify(messages) // Messages must be JSON stringified
    );

    console.log("🚀 Making AI request...");
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        messages: messages,
        model: model,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Inference failed: ${response.status} ${response.statusText}`
      );
    }

    type InferenceResponse = {
      choices?: Array<{ message?: { content?: string } }>;
      id?: string; // Chat ID for verification
    };

    const data = (await response.json()) as InferenceResponse;
    const content: string = data.choices?.[0]?.message?.content ?? "";
    const chatID = data.id;
    
    console.log("📝 Raw AI response:", content.substring(0, 100) + "...");
    console.log("📏 Response length:", content.length);
    console.log("🆔 Chat ID:", chatID);
    
    let valid = false;
    try {
      // For verifiable services, pass the chatID
      const result = await broker.inference.processResponse(
        providerAddress,
        content,
        chatID // Pass chatID for verification
      );
      valid = result ?? false;
      console.log("✅ Response verification result:", valid);
    } catch (verifyError) {
      console.error("❌ Response verification failed:", verifyError);
      // Continue without verification for now
      valid = false;
    }
    
    return { answer: content, verified: valid, model, endpoint };
  } catch (error) {
    console.error(
      `❌ Inference failed for ${providerAddress}:`,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}
