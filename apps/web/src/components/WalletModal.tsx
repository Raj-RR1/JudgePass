import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useDisconnect } from "wagmi";

export function WalletModal({
  isOpen,
  onClose,
  ensName,
}: {
  isOpen: boolean;
  onClose: () => void;
  ensName: string | null | undefined;
}) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-background-dark rounded-xl shadow-2xl w-full max-w-sm border border-neutral-200 dark:border-neutral-800"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                {ensName || "Connected Wallet"}
              </h3>
              <p className="mt-2 font-mono text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/50 p-2 rounded-lg break-all">
                {address}
              </p>
            </div>
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={handleDisconnect}
                className="w-full text-center py-2 px-4 rounded-lg font-bold text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
