import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ConnectWallet } from "./components/ConnectWallet";
import { HomePage } from "./pages/HomePage";
import { HackerSubmitPage } from "./pages/HackerSubmitPage";
import { HackerStatusPage } from "./pages/HackerStatusPage";
import { JudgeDashboardPage } from "./pages/JudgeDashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1>AI Judge Portal ✨</h1>
          </Link>
          <ConnectWallet />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<HackerSubmitPage />} />
            <Route path="/submission/:id" element={<HackerStatusPage />} />
            <Route path="/judge" element={<JudgeDashboardPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
