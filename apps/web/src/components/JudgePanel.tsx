import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { apiClient } from "../lib/apiClient"; // <-- Use the new apiClient
import { JudgeMetadata, Scorecard, Submission } from "../types";

interface Props {
  tokenId: number;
  wallet: string;
  metadata: JudgeMetadata;
  submission: Submission;
  onBack: () => void;
}

export function JudgePanel({
  tokenId,
  wallet,
  metadata,
  submission,
  onBack,
}: Props) {
  const [text, setText] = useState(submission.text);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    rootHash: string;
    txHash: string;
  } | null>(null);
  const [isJudging, setIsJudging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleRunJudge = async () => {
    setIsJudging(true);
    setScorecard(null);
    setUploadResult(null);

    const promise = apiClient.runJudge(tokenId, wallet, submission.id, text);

    toast.promise(promise, {
      loading: "Running AI Judge...",
      success: "Judge finished successfully!",
      error: (err) => err.message || "Failed to run judge.",
    });

    try {
      const result = await promise;
      setScorecard(result.scorecard);
    } catch (e) {
      console.error(e);
    } finally {
      setIsJudging(false);
    }
  };

  const handleSaveScorecard = async () => {
    if (!scorecard) return;
    setIsSaving(true);
    const promise = apiClient.uploadScorecard(tokenId, scorecard);

    toast.promise(promise, {
      loading: "Saving to 0G Storage...",
      success: "Scorecard saved!",
      error: (err) => err.message || "Failed to save.",
    });

    try {
      const result = await promise;
      setUploadResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <button onClick={onBack}>&larr; Back to Submissions</button>
      <div className="judge-grid">
        <div className="card">
          <h3>Submission: {submission.title}</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={15}
          ></textarea>
          <button onClick={handleRunJudge} disabled={isJudging || isSaving}>
            {isJudging ? "Judging..." : "Run Judge"}
          </button>
        </div>

        <div className="card">
          <h3>Rubric: {metadata.version}</h3>
          <ul>
            {metadata.rubric.map((r) => (
              <li key={r.criterion}>
                {r.criterion} (Weight: {r.weight})
              </li>
            ))}
          </ul>
        </div>

        {isJudging && (
          <div className="card result-card">
            <h3>Generating Scorecard...</h3>
            <p>
              <Skeleton count={3} />
            </p>
            <h4>
              <Skeleton width={150} />
            </h4>
            <p>
              <Skeleton count={2} />
            </p>
          </div>
        )}

        {scorecard && !isJudging && (
          <motion.div
            className="card result-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Judging Result</h3>
            <p>
              <strong>Status: </strong>
              <span className={scorecard.verified ? "verified" : "unverified"}>
                {scorecard.verified ? "Verified (TEE)" : "Unverified"}
              </span>
            </p>
            <p>
              <strong>
                Total Weighted Score: {scorecard.totalWeightedScore.toFixed(2)}
              </strong>
            </p>
            <p>
              <strong>Justification:</strong> {scorecard.justification}
            </p>
            <h4>Detailed Scores:</h4>
            <table>
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Score</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {scorecard.scores.map((s) => (
                  <tr key={s.criterion}>
                    <td>{s.criterion}</td>
                    <td>{s.score}</td>
                    <td>{s.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleSaveScorecard}
              disabled={isSaving || !!uploadResult}
            >
              {isSaving ? "Saving..." : "Save Scorecard to 0G Storage"}
            </button>
          </motion.div>
        )}

        {uploadResult && (
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Immutable Record Saved!</h3>
            <p>Your scorecard has been saved to 0G Storage.</p>
            <strong>Root Hash:</strong>
            <pre>
              <code>{uploadResult.rootHash}</code>
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(uploadResult.rootHash);
                toast.success("Root hash copied to clipboard!");
              }}
            >
              Copy Hash
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
