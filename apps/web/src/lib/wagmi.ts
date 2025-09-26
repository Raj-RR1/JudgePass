import { http, createConfig } from "wagmi";
import { defineChain } from "viem";

export const newtonTestnet = defineChain({
  id: 16600,
  name: "0G Newton Testnet",
  nativeCurrency: { name: "0G", symbol: "A0GI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "BlockScout", url: "https://scan-testnet.0g.ai" },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [newtonTestnet],
  transports: {
    [newtonTestnet.id]: http(),
  },
});
