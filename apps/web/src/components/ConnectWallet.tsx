import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { injected } from "wagmi/connectors";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: ensName, isLoading } = useEnsName({
    address: address,
    chainId: 1,
  });

  if (isConnected) {
    const truncateAddress = (addr: string) =>
      `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">
          {isLoading ? "..." : ensName || truncateAddress(address!)}
        </span>
        <button
          onClick={() => disconnect()}
          className="text-xs text-gray-500 hover:underline"
        >
          (Disconnect)
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
    >
      Connect Wallet
    </button>
  );
}
