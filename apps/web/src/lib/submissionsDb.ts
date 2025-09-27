// apps/web/src/lib/submissionsDb.ts

import { Submission } from "../types";

const DB_KEY = "hackathon_submissions_db";

// Type for a new submission (without the generated ID)
export type NewSubmission = Omit<Submission, "id">;

// Initialize with some demo data if the DB is empty
const initializeDb = () => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    const demoSubmissions: Submission[] = [
      {
        id: "sub-001",
        title: "Essay on Decentralization",
        team: "Alice",
        links: "github.com/alice",
        description:
          "Exploring the core principles and future of decentralized systems.",
        submittedAt: new Date().toISOString(),
      },
      {
        id: "sub-002",
        title: "Smart Contract Security Analysis",
        team: "Bob",
        links: "github.com/bob",
        description: "A brief analysis of common vulnerabilities in Solidity.",
        submittedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(DB_KEY, JSON.stringify(demoSubmissions));
  }
};

initializeDb();

export const getSubmissions = (): Submission[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const getSubmissionById = (id: string): Submission | undefined => {
  const submissions = getSubmissions();
  return submissions.find((sub) => sub.id === id);
};

export const addSubmission = (submission: NewSubmission): Submission => {
  const submissions = getSubmissions();
  const newSubmission: Submission = {
    ...submission,
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };
  submissions.push(newSubmission);
  localStorage.setItem(DB_KEY, JSON.stringify(submissions));
  return newSubmission;
};
