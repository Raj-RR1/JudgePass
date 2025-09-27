import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { JudgeLayout } from "./components/JudgeLayout";
import { HackerLayout } from "./components/HackerLayout";
import { HomePage } from "./pages/HomePage";
import { HackerSubmitPage } from "./pages/HackerSubmitPage";
import { HackerStatusPage } from "./pages/HackerStatusPage";
import { JudgeDashboardPage } from "./pages/JudgeDashboardPage";
import { SubmissionDetailPage } from "./pages/SubmissionDetailPage";
import { ScoringPage } from "./pages/ScoringPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { HackerDashboardPage } from "./pages/HackerDashboardPage";
import { HackerDisputesPage } from "./pages/HackerDisputesPage";
import { HackerSubmitDisputePage } from "./pages/HackerSubmitDisputePage";
import { JudgeSubmissionsPage } from "./pages/JudgeSubmissionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public-facing pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Standalone pages */}
        <Route path="/submission/:id" element={<HackerStatusPage />} />

        {/* Judge-facing pages with the dashboard layout */}
        <Route path="/judge" element={<JudgeLayout />}>
          <Route index element={<JudgeDashboardPage />} />
          <Route path="submissions" element={<JudgeSubmissionsPage />} />
          <Route path="submission/:id" element={<SubmissionDetailPage />} />
          <Route path="score/:id" element={<ScoringPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />{" "}
          {/* <-- Add this new route */}
        </Route>

        <Route path="/hacker" element={<HackerLayout />}>
          <Route index element={<HackerDashboardPage />} />
          <Route path="submissions" element={<HackerDashboardPage />} />
          <Route path="submit" element={<HackerSubmitPage />} />
          <Route path="disputes" element={<HackerDisputesPage />} />{" "}
          <Route path="disputes/new" element={<HackerSubmitDisputePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
