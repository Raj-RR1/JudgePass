import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2>Welcome to the AI Judging Portal</h2>
      <p>Please select your role to continue.</p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Link to="/submit" className="button-like">
          I'm a Hacker
        </Link>
        <Link to="/judge" className="button-like">
          I'm a Judge
        </Link>
      </div>
    </div>
  );
}
