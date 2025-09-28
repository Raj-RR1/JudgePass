import { JudgeMetadata } from "../types";

export function generateSmartMockResponse(
  submissionText: string,
  metadata: JudgeMetadata
): {
  scores: Array<{
    criterion: string;
    score: number;
    weight: number;
    justification: string;
  }>;
  totalWeightedScore: number;
  justification: string;
} {
  // Analyze the submission text for keywords to generate realistic scores
  const text = submissionText.toLowerCase();

  const scores = metadata.rubric.map((rubricItem) => {
    let score = 3; // Base score
    let justification = "";

    switch (rubricItem.criterion.toLowerCase()) {
      case "technical innovation":
      case "technical implementation":
        if (text.includes("blockchain") || text.includes("smart contract"))
          score += 1;
        if (
          text.includes("ai") ||
          text.includes("ml") ||
          text.includes("decentralized")
        )
          score += 0.5;
        if (text.includes("innovative") || text.includes("novel")) score += 0.5;
        justification = `Strong technical foundation using ${
          text.includes("blockchain")
            ? "blockchain technology"
            : "modern tech stack"
        }. ${
          text.includes("smart contract")
            ? "Smart contract integration shows technical depth."
            : ""
        } Shows solid implementation with innovative approach.`;
        break;

      case "user experience":
        if (
          text.includes("frontend") ||
          text.includes("ui") ||
          text.includes("react")
        )
          score += 0.5;
        if (text.includes("user") || text.includes("interface")) score += 0.5;
        justification = `${
          text.includes("frontend")
            ? "Frontend implementation demonstrates user-focused design"
            : "User interaction components identified"
        }. The project shows good consideration for user experience, though could benefit from enhanced UI/UX design.`;
        break;

      case "business potential":
        if (
          text.includes("market") ||
          text.includes("scalable") ||
          text.includes("commercial")
        )
          score += 1;
        if (text.includes("practical") || text.includes("real-world"))
          score += 0.5;
        justification = `${
          text.includes("decentralized")
            ? "Decentralized approach provides strong market differentiation"
            : "Practical application shows commercial awareness"
        }. The concept demonstrates clear business viability and market potential.`;
        break;

      default:
        score += Math.random() * 1; // Add some randomness for other criteria
        justification = `Based on project analysis, shows competent execution in ${rubricItem.criterion.toLowerCase()}. Demonstrates understanding of requirements with practical implementation.`;
    }

    // Cap score at 5 and ensure minimum of 1
    score = Math.min(5, Math.max(1, score));

    return {
      criterion: rubricItem.criterion,
      score: Math.round(score * 10) / 10, // Round to 1 decimal
      weight: rubricItem.weight,
      justification,
    };
  });

  const totalWeightedScore = scores.reduce(
    (sum, s) => sum + s.score * s.weight,
    0
  );

  return {
    scores,
    totalWeightedScore: Math.round(totalWeightedScore * 10) / 10,
    justification: `Comprehensive evaluation of this hackathon submission reveals a well-executed project with ${
      text.includes("blockchain")
        ? "innovative blockchain integration"
        : "solid technical implementation"
    }. The solution demonstrates practical problem-solving while maintaining technical rigor. Key strengths include comprehensive technology integration and clear value proposition. The project shows strong potential for real-world application and further development.`,
  };
}
