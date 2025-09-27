import { useState } from "react";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { injected } from "wagmi/connectors";
import { WalletModal } from "./WalletModal";
import { AnimatePresence, motion } from "framer-motion";

export function ConnectWalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  if (isConnected) {
    return (
      <>
        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ensName={ensName}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-primary">
            account_circle
          </span>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-sm truncate text-neutral-900 dark:text-white">
              {ensName || "Connected"}
            </p>
            <p className="font-mono text-xs truncate text-neutral-500 dark:text-neutral-400">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </button>
      </>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isConnecting}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
    >
      <AnimatePresence>
        {isConnecting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="material-symbols-outlined text-xl"
          >
            progress_activity
          </motion.div>
        ) : (
          <span className="material-symbols-outlined text-xl">login</span>
        )}
      </AnimatePresence>
      <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
    </button>
  );
}
