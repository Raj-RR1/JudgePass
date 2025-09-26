import { useState } from "react";
import { fetchJudgeMetadata } from "../lib/api";
import { JudgeMetadata } from "../types";

interface Props {
  wallet: string;
  onLoaded: (tokenId: number, metadata: JudgeMetadata) => void;
}

export function JudgeLoader({ wallet, onLoaded }: Props) {
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoad = async () => {
    if (!tokenId) return;
    setLoading(true);
    setError("");
    try {
      const id = parseInt(tokenId, 10);
      const { metadata } = await fetchJudgeMetadata(id, wallet);
      onLoaded(id, metadata);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Load Judge</h2>
      <p>Enter your INFT tokenId to load the judge configuration.</p>
      <input
        type="number"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="e.g., 1"
        disabled={loading}
      />
      <button onClick={handleLoad} disabled={loading || !tokenId}>
        {loading ? "Loading..." : "Load Judge"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
