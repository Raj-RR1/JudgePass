import { Link } from "react-router-dom";
import { getSubmissions } from "../lib/submissionsDb";
import { DisputeForm } from "../components/DisputeForm";

const StatusBadge = ({ status }: { status: string }) => {
  let colorClasses = "";
  switch (status.toLowerCase()) {
    case "in review":
      colorClasses =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      break;
    case "rejected":
      colorClasses =
        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      break;
    default: // Submitted
      colorClasses =
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses}`}
    >
      {status}
    </span>
  );
};

export function HackerDashboardPage() {
  const submissions = getSubmissions();

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
          My Submissions
        </h2>
        <Link
          to="/hacker/submit"
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary/90"
        >
          Submit Project
        </Link>
      </header>

      <div className="bg-background-light dark:bg-background-dark/50 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-neutral-600 dark:text-neutral-400 uppercase bg-neutral-100 dark:bg-neutral-900/50">
              <tr>
                <th className="px-6 py-4 font-medium">Project Name</th>
                <th className="px-6 py-4 font-medium">Submission Status</th>
                <th className="px-6 py-4 font-medium">Scorecard Root Hash</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/20"
                >
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                    {sub.title}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status="Submitted" />
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-neutral-500 dark:text-neutral-400">
                    N/A
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/submission/${sub.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the DisputeForm only if there are submissions */}
      {submissions.length > 0 && <DisputeForm submissions={submissions} />}
    </>
  );
}
