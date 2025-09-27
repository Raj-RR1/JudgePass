// apps/web/src/components/ConnectWallet.tsx

import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { injected } from "wagmi/connectors";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // --- ENS Integration ---
  // Fetch the ENS name for the connected address
  const { data: ensName, isLoading } = useEnsName({
    address: address,
    chainId: 1, // ENS names are primarily on Ethereum Mainnet
  });
  // --- End ENS Integration ---

  if (isConnected) {
    const truncateAddress = (addr: string) =>
      `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
      <div className="wallet-info">
        {/*
          Display Logic:
          1. If ENS name is loading, show a loading state.
          2. If ENS name exists, display it.
          3. Otherwise, fall back to the truncated address.
        */}
        <span>
          {isLoading ? "Fetching ENS..." : ensName || truncateAddress(address!)}
        </span>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }
  return (
    <button onClick={() => connect({ connector: injected() })}>
      Connect Wallet
    </button>
  );
}
