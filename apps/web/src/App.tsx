import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectWallet } from "./components/ConnectWallet";
import { JudgeLoader } from "./components/JudgeLoader";
import { JudgePanel } from "./components/JudgePanel";
import { SubmissionsList } from "./components/SubmissionsList";
import { JudgeMetadata, Submission } from "./types";

// Static submission data for the demo
const DEMO_SUBMISSIONS: Submission[] = [
  {
    id: "sub-001",
    title: "Essay on Decentralization",
    description:
      "Exploring the core principles and future of decentralized systems.",
    text: "Decentralization is not merely a technological shift; it is a philosophical one. It champions a world where trust is distributed...",
  },
  {
    id: "sub-002",
    title: "Smart Contract Security Analysis",
    description: "A brief analysis of common vulnerabilities in Solidity.",
    text: "Common vulnerabilities in Solidity include reentrancy, integer overflow, and front-running. To mitigate reentrancy...",
  },
];

export default function App() {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [metadata, setMetadata] = useState<JudgeMetadata | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const handleJudgeLoaded = (id: number, meta: JudgeMetadata) => {
    setTokenId(id);
    setMetadata(meta);
  };

  const resetFlow = () => {
    setTokenId(null);
    setMetadata(null);
    setSelectedSubmission(null);
  };

  return (
    <div className="container">
      <header>
        <h1>AI Judge Portal</h1>
        <ConnectWallet />
      </header>

      {!address ? (
        <p className="notice">Connect your wallet to begin.</p>
      ) : !metadata ? (
        <JudgeLoader wallet={address} onLoaded={handleJudgeLoaded} />
      ) : !selectedSubmission ? (
        <div>
          <h2>Submissions for Judge: {metadata.version}</h2>
          <SubmissionsList
            items={DEMO_SUBMISSIONS}
            onJudge={setSelectedSubmission}
          />
          <button onClick={resetFlow} style={{ marginTop: "1rem" }}>
            Load Another Judge
          </button>
        </div>
      ) : (
        <JudgePanel
          tokenId={tokenId!}
          wallet={address}
          metadata={metadata}
          submission={selectedSubmission}
          onBack={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
