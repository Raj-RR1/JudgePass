// apps/web/src/pages/JudgeSubmissionsPage.tsx

import { Link } from "react-router-dom";
import { getSubmissions } from "../lib/submissionsDb";

export function JudgeSubmissionsPage() {
  const submissions = getSubmissions();

  return (
    <>
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Submissions
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Review and select a project to begin judging.
        </p>
      </header>
      <section>
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
