import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSubmissionById } from "../lib/submissionsDb";
import { Submission } from "../types";

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
      <div className="card">
        <h2>Submission Not Found</h2>
        <p>We couldn't find a submission with that ID.</p>
        <Link to="/submit">Submit a new project</Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Submission Received!</h2>
      <p>Thank you for submitting your project. Here are your details:</p>

      <p>
        <strong>Submission ID:</strong> <code>{submission.id}</code>
      </p>
      <p>
        <strong>Title:</strong> {submission.title}
      </p>
      <p>
        <strong>Team:</strong> {submission.team}
      </p>
      <p>
        <strong>Links:</strong> {submission.links}
      </p>
      <p>
        <strong>Submitted On:</strong>{" "}
        {new Date(submission.submittedAt).toLocaleString()}
      </p>
      <p>
        <strong>Description:</strong>
      </p>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          backgroundColor: "#333",
          padding: "1rem",
          borderRadius: "4px",
        }}
      >
        {submission.description}
      </pre>

      <Link to="/submit" style={{ marginTop: "2rem", display: "inline-block" }}>
        Submit another project
      </Link>
    </div>
  );
}
