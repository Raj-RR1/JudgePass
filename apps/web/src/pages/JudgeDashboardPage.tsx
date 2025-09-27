import { useState } from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { JudgeLoader } from "../components/JudgeLoader";
import { JudgePanel } from "../components/JudgePanel";
import { getSubmissions } from "../lib/submissionsDb";
import { JudgeMetadata, Submission } from "../types";

export function JudgeDashboardPage() {
  const { address, isConnected } = useAccount();
  const [metadata, setMetadata] = useState<JudgeMetadata | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const tokenIdFromStorage = localStorage.getItem("judge_app_last_token_id");

  const submissions = getSubmissions();

  // If wallet is not connected, show a prompt
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

  // If the judge INFT is not loaded, show the JudgeLoader component
  if (!metadata) {
    return (
      <JudgeLoader
        wallet={address}
        onLoaded={(id, meta) => setMetadata(meta)}
      />
    );
  }

  // If a submission is selected, show the JudgePanel for judging
  if (selectedSubmission) {
    return (
      <JudgePanel
        tokenId={JSON.parse(tokenIdFromStorage!)}
        wallet={address}
        metadata={metadata}
        submission={selectedSubmission}
        onBack={() => setSelectedSubmission(null)}
      />
    );
  }

  // Otherwise, show the main dashboard view
  return (
    <>
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Judge Loaded: {metadata.version}
        </p>
      </header>
      <section className="mb-8">
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
          {/* Other stat cards can be made dynamic later */}
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
      <section>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Submissions
        </h3>
        <div className="overflow-x-auto bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">
                  Project Name
                </th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">
                  Team
                </th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-t border-gray-200 dark:border-gray-800"
                >
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                    {sub.title}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {sub.team}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      {" "}
                      Submitted{" "}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/judge/submission/${sub.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      View & Judge
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
