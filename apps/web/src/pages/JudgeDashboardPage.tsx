import { useState } from "react";
import { useAccount } from "wagmi";
import { JudgeLoader } from "../components/JudgeLoader";
import { JudgePanel } from "../components/JudgePanel";
import { SubmissionsList } from "../components/SubmissionsList";
import { JudgeMetadata, Submission } from "../types";

export function JudgeDashboardPage() {
  const { address, isConnected } = useAccount();
  const [tokenId, setTokenId] = useState<number | null>(() => {
    const savedTokenId = localStorage.getItem("judge_app_last_token_id");
    return savedTokenId ? JSON.parse(savedTokenId) : null;
  });
  const [metadata, setMetadata] = useState<JudgeMetadata | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  if (!isConnected) {
    return (
      <p className="notice">
        Please connect your wallet to access the judge dashboard.
      </p>
    );
  }

  const handleJudgeLoaded = (id: number, meta: JudgeMetadata) => {
    setTokenId(id);
    setMetadata(meta);
  };

  const resetFlow = () => {
    setTokenId(null);
    setMetadata(null);
    setSelectedSubmission(null);
    localStorage.removeItem("judge_app_last_token_id");
  };

  if (!metadata) {
    return <JudgeLoader wallet={address!} onLoaded={handleJudgeLoaded} />;
  }

  if (!selectedSubmission) {
    return (
      <div>
        <h2>Submissions for Judge: {metadata.version}</h2>
        <SubmissionsList onJudge={setSelectedSubmission} />
        <button onClick={resetFlow} style={{ marginTop: "1rem" }}>
          Load Another Judge
        </button>
      </div>
    );
  }

  return (
    <JudgePanel
      tokenId={tokenId!}
      wallet={address!}
      metadata={metadata}
      submission={selectedSubmission}
      onBack={() => setSelectedSubmission(null)}
    />
  );
}
