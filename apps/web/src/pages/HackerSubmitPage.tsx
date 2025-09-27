import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addSubmission } from "../lib/submissionsDb";
import { toast } from "react-hot-toast";

export function HackerSubmitPage() {
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [links, setLinks] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !team || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);

    const newSubmission = addSubmission({
      title,
      team,
      links,
      description,
      submittedAt: new Date().toISOString(),
    });

    toast.success("Project submitted successfully!");
    navigate(`/hacker/submissions`);
  };

  return (
    <>
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Submit a New Project
        </h2>
      </header>
      <div className="bg-background-light dark:bg-background-dark/50 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Project Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Project"
              required
              className="mt-1 block w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/50 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Team Name / Your Name
            </label>
            <input
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="The Builders"
              required
              className="mt-1 block w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/50 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Links (GitHub, Demo, etc.)
            </label>
            <input
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              placeholder="github.com/..."
              className="mt-1 block w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/50 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              placeholder="Describe your project..."
              required
              className="mt-1 block w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/50 shadow-sm focus:border-primary focus:ring-primary"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
