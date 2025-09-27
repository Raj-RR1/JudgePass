import { useState } from "react";
import { toast } from "react-hot-toast";
import { apiClient } from "../lib/apiClient"; // <-- Uses the swappable client
import { JudgeMetadata } from "../types";

interface Props {
  wallet: string;
  onLoaded: (tokenId: number, metadata: JudgeMetadata) => void;
}

export function JudgeLoader({ wallet, onLoaded }: Props) {
  const [tokenId, setTokenId] = useState(() => {
    const saved = localStorage.getItem("judge_app_last_token_id");
    return saved ? JSON.parse(saved) : "";
  });
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    if (!tokenId) return;
    setLoading(true);

    const id = parseInt(tokenId, 10);
    // Use the apiClient to make the call (will be mock or real based on .env)
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
    <div className="card">
      <h2>Load Judge</h2>
      <p>Enter your INFT tokenId to load the judge configuration.</p>
      <input
        type="number"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="e.g., 1 (Hint: Use 1 for mock success)"
        disabled={loading}
      />
      <button onClick={handleLoad} disabled={loading || !tokenId}>
        {loading ? "Loading..." : "Load Judge"}
      </button>
    </div>
  );
}
