import { DisputeForm } from "../components/DisputeForm";
import { getSubmissions } from "../lib/submissionsDb";

export function HackerSubmitDisputePage() {
  const submissions = getSubmissions();

  return (
    <>
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
          File a New Dispute
        </h2>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Select a project and clearly explain the grounds for your dispute.
        </p>
      </header>
      <div className="bg-background-light dark:bg-background-dark/50 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
        <DisputeForm submissions={submissions} />
      </div>
    </>
  );
}
