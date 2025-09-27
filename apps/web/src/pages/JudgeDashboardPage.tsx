// apps/web/src/pages/JudgeDashboardPage.tsx

import { useState } from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { JudgeLoader } from "../components/JudgeLoader";
import { getSubmissions } from "../lib/submissionsDb";
import { JudgeMetadata } from "../types";

export function JudgeDashboardPage() {
  const { address, isConnected } = useAccount();
  const [metadata, setMetadata] = useState<JudgeMetadata | null>(() => {
    const metaFromStorage = localStorage.getItem("judge_app_metadata");
    return metaFromStorage ? JSON.parse(metaFromStorage) : null;
  });

  const submissions = getSubmissions();

  if (!isConnected) {
    return (
      <div className="text-center p-10 bg-white/5 dark:bg-black/5 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">Welcome, Judge!</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please connect your wallet to access the dashboard and begin judging.
        </p>
      </div>
    );
  }

  if (!metadata) {
    return (
      <JudgeLoader
        wallet={address}
        onLoaded={(id, meta) => {
          const fullMeta = { ...meta, tokenId: id };
          setMetadata(fullMeta);
          localStorage.setItem("judge_app_metadata", JSON.stringify(fullMeta));
        }}
      />
    );
  }

  return (
    <>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Judge Loaded: {metadata.version}
          </p>
        </div>
        <Link
          to="/judge/submissions"
          className="bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          View All Submissions
        </Link>
      </header>
      <section>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <p className="text-base font-medium text-gray-600 dark:text-gray-400">
              Total Submissions
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {submissions.length}
            </p>
          </div>
          <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <p className="text-base font-medium text-gray-600 dark:text-gray-400">
              Judges Assigned
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              1
            </p>
          </div>
          <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <p className="text-base font-medium text-gray-600 dark:text-gray-400">
              Judging Progress
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              0%
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
