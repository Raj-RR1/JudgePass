export type JudgeMetadata = {
  version: string;
  rubric: Array<{ criterion: string; weight: number }>;
  prompts: { system: string; userTemplate: string };
  modelHint?: string;
};

export type Scorecard = {
  tokenId: number;
  submissionId: string;
  scores: Array<{ criterion: string; score: number; weight: number }>;
  totalWeightedScore: number;
  justification: string;
  provider: string;
  model: string;
  verified: boolean;
  createdAt: number;
};

export type Submission = {
  id: string;
  title: string;
  description: string;
  text: string;
};
