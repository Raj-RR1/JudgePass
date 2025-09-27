import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSubmissionById } from "../lib/submissionsDb";
import { Submission } from "../types";

// This is the main layout for the status page, which includes the header
const StatusPageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display">
    <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-neutral-200 dark:border-neutral-800 bg-background-light/80 px-10 py-3 backdrop-blur-sm dark:bg-background-dark/80">
      <Link to="/" className="flex items-center gap-4">
        <div className="h-8 w-8 text-primary">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
          ProofJudge
        </h2>
      </Link>
      <Link
        to="/hacker"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary/90"
      >
        Back to Dashboard
      </Link>
    </header>
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  </div>
);

export function HackerStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (id) {
      const sub = getSubmissionById(id);
      setSubmission(sub || null);
    }
  }, [id]);

  if (!submission) {
    return (
      <StatusPageLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Submission Not Found</h2>
          <p className="mt-2 text-neutral-500">
            We couldn't find a submission with that ID.
          </p>
        </div>
      </StatusPageLayout>
    );
  }

  return (
    <StatusPageLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 mb-4">
            Submitted
          </span>
          <h1 className="text-4xl font-bold tracking-tighter text-black dark:text-white sm:text-5xl">
            {submission.title}
          </h1>
          <p className="mt-2 text-lg text-black/60 dark:text-white/60">
            Submitted by {submission.team} on{" "}
            {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </header>

        <div className="bg-background-light dark:bg-background-dark/50 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Description
            </h3>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
              {submission.description}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Links
            </h3>
            <a
              href={submission.links}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block font-medium text-primary hover:underline"
            >
              {submission.links}
            </a>
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Submission ID
            </h3>
            <p className="mt-2 font-mono text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/50 p-2 rounded">
              {submission.id}
            </p>
          </div>
        </div>
      </div>
    </StatusPageLayout>
  );
}
