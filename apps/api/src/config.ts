import { config } from "dotenv";
config({ path: ".env" });

export const OG_RPC_URL =
  process.env.OG_RPC_URL ?? "https://evmrpc-testnet.0g.ai";
export const INDEXER_RPC_URL =
  process.env.INDEXER_RPC ?? "https://indexer-storage-testnet-turbo.0g.ai";
export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
export const INFT_CONTRACT_ADDRESS = process.env.INFT_CONTRACT_ADDRESS ?? "";
export const METADATA_SYM_KEY_BASE64 =
  process.env.METADATA_SYM_KEY_BASE64 ?? "";
export const KV_URL = process.env.KV_URL ?? "";
export const PORT = Number(process.env.PORT ?? 3001);

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is required");
if (!INFT_CONTRACT_ADDRESS)
  throw new Error("INFT_CONTRACT_ADDRESS is required");
if (!METADATA_SYM_KEY_BASE64)
  throw new Error("METADATA_SYM_KEY_BASE64 is required");
