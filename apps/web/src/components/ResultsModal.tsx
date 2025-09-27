import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Scorecard } from "../types";
import { apiClient } from "../lib/apiClient";
import { useState } from "react";

export function ResultsModal({
  scorecard,
  onClose,
}: {
  scorecard: Scorecard;
  onClose: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const promise = apiClient.uploadScorecard(scorecard.tokenId, scorecard);
    toast.promise(promise, {
      loading: "Saving to 0G Storage...",
      success: (data) => {
        navigator.clipboard.writeText(data.rootHash);
        return `Scorecard saved! Root hash copied to clipboard.`;
      },
      error: (err) => err.message || "Failed to save.",
    });

    try {
      await promise;
      onClose(); // Close modal on success
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-background-dark rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-800"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Scoring Complete
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This result was generated and verified by the compute network.
            </p>
          </div>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <p>
              <strong>
                Total Weighted Score: {scorecard.totalWeightedScore.toFixed(2)}
              </strong>
            </p>
            <p>
              <strong>Status: </strong>
              <span
                className={
                  scorecard.verified ? "text-green-500" : "text-yellow-500"
                }
              >
                {scorecard.verified ? "Verified (TEE)" : "Unverified"}
              </span>
            </p>
            <div>
              <p className="font-bold mb-2">AI Justification:</p>
              <p className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                {scorecard.justification}
              </p>
            </div>
            <div>
              <p className="font-bold mb-2">Detailed Scores:</p>
              <div className="divide-y divide-gray-200 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg">
                {scorecard.scores.map((s) => (
                  <div key={s.criterion} className="flex justify-between p-3">
                    <span className="text-gray-600 dark:text-gray-300">
                      {s.criterion}
                    </span>
                    <span className="font-bold">{s.score.toFixed(1)} / 10</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save to 0G Storage"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
