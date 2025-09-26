import { Submission } from "../types";

interface Props {
  items: Submission[];
  onJudge: (submission: Submission) => void;
}

export function SubmissionsList({ items, onJudge }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>
              <button onClick={() => onJudge(item)}>Judge</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
