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
    // Redirect to the status page for the new submission
    navigate(`/submission/${newSubmission.id}`);
  };

  return (
    <div className="card">
      <h2>Submit Your Project</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Project"
          required
        />

        <label>Team Name / Your Name</label>
        <input
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          placeholder="The Builders"
          required
        />

        <label>Links (GitHub, Demo, etc.)</label>
        <input
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          placeholder="github.com/..."
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          placeholder="Describe your project..."
          required
        ></textarea>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Project"}
        </button>
      </form>
    </div>
  );
}
