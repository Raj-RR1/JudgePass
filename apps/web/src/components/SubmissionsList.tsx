import { getSubmissions } from "../lib/submissionsDb";
import { Submission } from "../types";

interface Props {
  onJudge: (submission: Submission) => void;
}

export function SubmissionsList({ onJudge }: Props) {
  const items = getSubmissions();

  if (items.length === 0) {
    return <p className="notice">No submissions yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Team</th>
          <th>Submitted On</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.team}</td>
            <td>{new Date(item.submittedAt).toLocaleString()}</td>
            <td>
              <button onClick={() => onJudge(item)}>Judge</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
