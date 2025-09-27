import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Verifiable Hackathon Judging
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            ProofJudge leverages INFTs and 0G Storage/Compute for a transparent
            and fair judging process.
          </p>
        </div>
      </section>
      <section className="pb-20 md:pb-32">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Choose Your Role
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            Select your role to access your dedicated dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            {/* Hacker Card */}
            <div className="group relative flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300">
              <div className="mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-4xl">code</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Hacker
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Build, submit, and manage your hackathon projects.
              </p>
              <Link
                to="/hacker"
                className="w-full bg-primary text-white text-sm font-bold py-3 px-6 rounded-lg text-center hover:opacity-90 transition-opacity"
              >
                Go to Hacker Dashboard
              </Link>
            </div>
            {/* Judge Card */}
            <div className="group relative flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300">
              <div className="mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-4xl">
                  gavel
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Judge / Organizer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Review submissions, manage judging, and organize events.
              </p>
              <Link
                to="/judge"
                className="w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-bold py-3 px-6 rounded-lg text-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Go to Judge Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
