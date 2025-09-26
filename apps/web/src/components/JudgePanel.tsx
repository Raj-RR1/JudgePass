import { useState } from "react";
import { JudgeMetadata, Scorecard, Submission } from "../types";
import { runJudge, uploadScorecard } from "../lib/api";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRunJudge = async () => {
    setLoading(true);
    setError("");
    setScorecard(null);
    setUploadResult(null);
    try {
      const result = await runJudge(tokenId, wallet, submission.id, text);
      setScorecard(result.scorecard);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScorecard = async () => {
    if (!scorecard) return;
    setLoading(true);
    setError("");
    try {
      const result = await uploadScorecard(tokenId, scorecard);
      setUploadResult(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
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
          <button onClick={handleRunJudge} disabled={loading}>
            {loading ? "Judging..." : "Run Judge"}
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

        {error && <p className="error">{error}</p>}

        {scorecard && (
          <div className="card result-card">
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
              disabled={loading || !!uploadResult}
            >
              {loading ? "Saving..." : "Save Scorecard to 0G Storage"}
            </button>
          </div>
        )}

        {uploadResult && (
          <div className="card">
            <h3>Immutable Record Saved!</h3>
            <p>Your scorecard has been saved to 0G Storage.</p>
            <strong>Root Hash:</strong>
            <pre>
              <code>{uploadResult.rootHash}</code>
            </pre>
            <button
              onClick={() =>
                navigator.clipboard.writeText(uploadResult.rootHash)
              }
            >
              Copy Hash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
