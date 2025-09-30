import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { getSubmissionById } from "../lib/submissionsDb";
import { JudgeMetadata, Submission, Scorecard } from "../types";
import { apiClient } from "../lib/apiClient";
import { toast } from "react-hot-toast";
import { ResultsModal } from "../components/ResultsModal";
import { useWalletSigner } from "../lib/walletSigner";

export function ScoringPage() {
  const { id } = useParams<{ id: string }>();
  const { address } = useAccount();
  const navigate = useNavigate();
  const walletSigner = useWalletSigner();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [metadata, setMetadata] = useState<JudgeMetadata | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScorecard, setFinalScorecard] = useState<Scorecard | null>(null);

  useEffect(() => {
    // Load submission data from local DB
    if (id) {
      setSubmission(getSubmissionById(id) || null);
    }
    // Load judge metadata from local storage (set when judge loaded INFT)
    const metaFromStorage = localStorage.getItem("judge_app_metadata");
    if (metaFromStorage) {
      setMetadata(JSON.parse(metaFromStorage));
    }
  }, [id]);

  const handleScoreChange = (criterion: string, value: string) => {
    setScores((prev) => ({ ...prev, [criterion]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission || !metadata || !address) return;

    if (!walletSigner) {
      toast.error("Please connect your wallet to submit for scoring");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a message to sign for authentication
      const message = `JudgePass: Submit for scoring submission ${submission.id} at ${Date.now()}`;
      const signature = await walletSigner.signMessage(message);
      
      const walletInfo = {
        address: walletSigner.address,
        signature,
        message,
      };

      // In a real app, you would use the manually entered scores.
      // For this project's flow, we trigger the AI inference with the description.
      // Get tokenId from localStorage or use a default value
      const tokenId = Number(localStorage.getItem("judge_token_id") || "1");
      const promise = apiClient.runJudge(
        tokenId,
        address,
        submission.id,
        submission.description,
        walletInfo
      );

      toast.promise(promise, {
        loading: "Submitting to AI for scoring...",
        success: "AI scoring complete!",
        error: (err) => err.message || "Scoring failed.",
      });

      const result = await promise;
      setFinalScorecard(result.scorecard);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit for scoring. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!metadata || !submission) {
    return (
      <div>
        Loading details... If this persists, please go back to the dashboard and
        load your Judge INFT.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {finalScorecard && (
        <ResultsModal
          scorecard={finalScorecard}
          onClose={() => navigate("/judge")}
        />
      )}

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Judging Rubric
      </h2>
      <div className="bg-white dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Project Details
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Project Name
            </p>
            <p className="md:col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {submission.title}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Team
            </p>
            <p className="md:col-span-2 text-sm text-gray-800 dark:text-gray-200">
              {submission.team}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Submission
            </p>
            <Link
              to={`/judge/submission/${submission.id}`}
              className="md:col-span-2 text-sm text-primary hover:underline"
            >
              Link to Full Submission Details
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Judging Criteria (from {metadata.version})
          </h3>
        </div>
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {metadata.rubric.map(({ criterion }) => (
            <div
              key={criterion}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
            >
              <label className="font-medium text-gray-700 dark:text-gray-300 md:pt-3">
                {criterion}
              </label>
              <div className="md:col-span-2">
                <input
                  className="form-input w-full rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary text-gray-800 dark:text-gray-200"
                  max="10"
                  min="1"
                  placeholder="Score (1-10)"
                  type="number"
                  value={scores[criterion] || ""}
                  onChange={(e) => handleScoreChange(criterion, e.target.value)}
                />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label
              className="font-medium text-gray-700 dark:text-gray-300 md:pt-3"
              htmlFor="justification"
            >
              Justification
            </label>
            <div className="md:col-span-2">
              <textarea
                className="form-textarea w-full rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary text-gray-800 dark:text-gray-200"
                id="justification"
                placeholder="Your justification will be overridden by the AI's justification."
                rows={5}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit & Trigger AI Inference"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}