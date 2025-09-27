// apps/web/src/lib/disputesDb.ts

export type Dispute = {
  id: string;
  projectName: string;
  reason: string;
  status: "Open" | "Resolved" | "Closed";
  submittedAt: string;
};

export type NewDispute = Omit<Dispute, "id" | "status" | "submittedAt">;

const DB_KEY = "hackathon_disputes_db";

const initializeDb = () => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    const demoDisputes: Dispute[] = [
      {
        id: "disp-001",
        projectName: "Project Beta",
        reason: "Unfair judging",
        status: "Resolved",
        submittedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(DB_KEY, JSON.stringify(demoDisputes));
  }
};

initializeDb();

export const getDisputes = (): Dispute[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const addDispute = (dispute: NewDispute): Dispute => {
  const disputes = getDisputes();
  const newDispute: Dispute = {
    ...dispute,
    id: `disp-${Date.now()}`,
    status: "Open",
    submittedAt: new Date().toISOString(),
  };
  disputes.push(newDispute);
  localStorage.setItem(DB_KEY, JSON.stringify(disputes));
  return newDispute;
};
