import { useState } from "react";
import { toast } from "react-hot-toast";
import { apiClient } from "../lib/apiClient";
import { JudgeMetadata } from "../types";

export function JudgeLoader({
  wallet,
  onLoaded,
}: {
  wallet: string;
  onLoaded: (tokenId: number, metadata: JudgeMetadata) => void;
}) {
  const [tokenId, setTokenId] = useState(() => {
    const saved = localStorage.getItem("judge_app_last_token_id");
    return saved ? JSON.parse(saved) : "";
  });
  const [loading, setLoading] = useState(false);

  const handleLoad = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!tokenId) return;

    setLoading(true);
    const id = parseInt(tokenId, 10);
    const promise = apiClient.fetchJudgeMetadata(id, wallet);

    toast.promise(promise, {
      loading: "Loading Judge Metadata...",
      success: (data) => {
        onLoaded(id, data.metadata);
        return "Judge loaded successfully!";
      },
      error: (err) => err.message || "Failed to load Judge.",
    });

    promise.catch(() => {}).finally(() => setLoading(false));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Load Your Judge Profile
        </h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Enter your INFT Token ID to configure the judging rubric and access
          your dashboard.
        </p>
      </header>
      <div className="bg-background-light dark:bg-background-dark/50 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
        <form onSubmit={handleLoad} className="space-y-6">
          <div>
            <label
              htmlFor="tokenId"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              INFT Token ID
            </label>
            <input
              id="tokenId"
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="e.g., 1 (Use 1 for mock success)"
              required
              disabled={loading}
              className="mt-1 block w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/50 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !tokenId}
              className="inline-flex items-center justify-center gap-2 py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined">fact_check</span>
              <span>{loading ? "Loading..." : "Load Judge"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
