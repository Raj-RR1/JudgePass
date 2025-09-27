import { useState } from "react";
import { toast } from "react-hot-toast";
import { Submission } from "../types";

export function DisputeForm({ submissions }: { submissions: Submission[] }) {
  const [selectedProject, setSelectedProject] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !reason) {
      toast.error("Please select a project and provide a reason.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(`Dispute for "${selectedProject}" submitted successfully!`);
      setSelectedProject("");
      setReason("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
        Dispute Filing
      </h3>
      <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
        If you believe there has been an error in the judging of your
        submission, you may file a dispute.
      </p>
      <form className="mt-6 max-w-lg space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            htmlFor="project-select"
          >
            Select Project
          </label>
          <select
            id="project-select"
            name="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="mt-1 block w-full rounded border-neutral-300 dark:border-neutral-700 bg-background-light dark:bg-background-dark/80 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="" disabled>
              Select a project...
            </option>
            {submissions.map((sub) => (
              <option key={sub.id} value={sub.title}>
                {sub.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            htmlFor="dispute-reason"
          >
            Reason for Dispute
          </label>
          <textarea
            id="dispute-reason"
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Clearly explain the grounds for your dispute..."
            rows={4}
            className="mt-1 block w-full rounded border-neutral-300 dark:border-neutral-700 bg-background-light dark:bg-background-dark/80 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-dark focus:ring-primary disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Dispute"}
          </button>
        </div>
      </form>
    </div>
  );
}
