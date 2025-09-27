import { Link } from "react-router-dom";
import { getDisputes } from "../lib/disputesDb";

const StatusBadge = ({
  status,
}: {
  status: "Open" | "Resolved" | "Closed";
}) => {
  let colorClasses = "";
  switch (status) {
    case "Resolved":
      colorClasses =
        "bg-green-500/20 text-green-600 dark:bg-green-400/20 dark:text-green-300";
      break;
    case "Closed":
      colorClasses =
        "bg-red-500/20 text-red-600 dark:bg-red-400/20 dark:text-red-300";
      break;
    default: // Open
      colorClasses =
        "bg-yellow-500/20 text-yellow-600 dark:bg-yellow-400/20 dark:text-yellow-300";
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses}`}
    >
      {status}
    </span>
  );
};

export function HackerDisputesPage() {
  const disputes = getDisputes();

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Disputes
        </h2>
        <Link
          to="/hacker/disputes/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Submit New Dispute</span>
        </Link>
      </div>
      <div className="bg-background-light dark:bg-background-dark/50 rounded-lg border border-primary/20 dark:border-primary/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/10 dark:bg-primary/20 border-b border-primary/20 dark:border-primary/30">
                <th className="p-4 font-bold text-gray-700 dark:text-white">
                  Project Name
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-white">
                  Dispute Reason
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-white">
                  Status
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/20 dark:divide-primary/30">
              {disputes.map((dispute) => (
                <tr key={dispute.id}>
                  <td className="p-4 text-gray-900 dark:text-white">
                    {dispute.projectName}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {dispute.reason}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={dispute.status} />
                  </td>
                  <td className="p-4">
                    <button className="font-bold text-primary hover:underline">
                      {dispute.status === "Resolved" ? "View" : "Review"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
