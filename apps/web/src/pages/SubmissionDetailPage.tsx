import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { getSubmissionById } from "../lib/submissionsDb";
import { JudgeMetadata, Submission } from "../types";
import { JudgePanel } from "../components/JudgePanel";
import { JudgeLoader } from "../components/JudgeLoader";

// A small component for the link boxes
const InfoLink = ({
  href,
  text,
  icon,
}: {
  href: string;
  text: string;
  icon: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all group"
  >
    <span className="font-medium text-gray-800 dark:text-gray-200">{text}</span>
    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-1">
      {icon}
    </span>
  </a>
);

export function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { address, isConnected } = useAccount();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [metadata, setMetadata] = useState<JudgeMetadata | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const tokenIdFromStorage = localStorage.getItem("judge_app_last_token_id");

  useEffect(() => {
    if (id) {
      setSubmission(getSubmissionById(id) || null);
    }
  }, [id]);

  const handleJudgeLoaded = (_id: number, meta: JudgeMetadata) => {
    // Add tokenId to meta object before saving
    const fullMeta = { ...meta, tokenId: _id };
    setMetadata(fullMeta);
    localStorage.setItem("judge_app_metadata", JSON.stringify(fullMeta));
  };

  // If the judge hasn't loaded their INFT yet, show the loader.
  if (!metadata) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Load Your Judge Profile
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Before you can score this submission, please load your INFT to
          configure the judging rubric.
        </p>
        {isConnected && (
          <JudgeLoader wallet={address!} onLoaded={handleJudgeLoaded} />
        )}
      </div>
    );
  }

  // If "Start Scoring" is clicked, render the JudgePanel.
  if (isScoring && submission) {
    return (
      <JudgePanel
        tokenId={JSON.parse(tokenIdFromStorage!)}
        wallet={address!}
        metadata={metadata}
        submission={submission}
        onBack={() => setIsScoring(false)} // Go back to the details view
      />
    );
  }

  if (!submission) {
    return <div>Submission not found.</div>;
  }

  // The main submission details view
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left side: Submission Info */}
      <div className="w-full lg:w-2/3">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {submission.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Submitted by {submission.team}
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Project Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {submission.description}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Links
            </h3>
            <div className="space-y-3">
              <InfoLink
                href={submission.links}
                text="Project Repository / Demo"
                icon="arrow_forward"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Judge's Actions */}
      <div className="w-full lg:w-1/3 lg:sticky lg:top-24 h-fit">
        <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Judge's Actions
          </h3>
          <Link
            to={`/judge/score/${submission.id}`}
            className="w-full flex items-center justify-center rounded-lg bg-primary h-12 px-6 text-white text-base font-bold hover:opacity-90 transition-opacity"
          >
            Start Scoring
          </Link>
        </div>
      </div>
    </div>
  );
}
