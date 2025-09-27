import type { Server } from "bun";
import { isAuthorizedOrOwner, getEncryptedURI } from "../services/inft";
import {
  fetchEncryptedPayload,
  uploadJsonToStorage,
} from "../services/storage";
import { registerRoute, RouteHandler } from "../server";
import { decryptAesGcmBase64 } from "../services/crypto";
import { METADATA_SYM_KEY_BASE64 } from "../config";
import type { JudgeMetadata, ScoreCard } from "../types";
import { listServices, runJudgingInference } from "../services/compute";

function jsonResponse(data: unknown, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

interface Service {
  model: string;
  provider: string;
}

export function registerJudge() {
  const servicesHandler: RouteHandler = async () => {
    try {
      console.log("Fetching services...");
      const services = await listServices();
      console.log("Services response:", services);
      console.log("Services type:", typeof services);
      console.log(
        "Services length:",
        Array.isArray(services) ? services.length : "not array"
      );
      return jsonResponse({ services });
    } catch (error) {
      console.error("Error fetching services:", error);
      return jsonResponse(
        { error: "Failed to fetch services", services: [] },
        500
      );
    }
  };

  registerRoute("/judge/services", servicesHandler);

  const metadataHandler: RouteHandler = async (req) => {
    const url = new URL(req.url);

    const pathParts = url.pathname.split("/");

    if (pathParts.length < 3 || pathParts[2] === "") {
      return jsonResponse({ error: "Invalid token ID format" }, 400);
    }

    const tokenId = Number(pathParts[2]);

    if (isNaN(tokenId) || tokenId < 0) {
      return jsonResponse(
        { error: "Invalid token ID: must be a positive number" },
        400
      );
    }

    const wallet = url.searchParams.get("wallet");

    if (!wallet) {
      return jsonResponse({ error: "wallet query param required" }, 400);
    }

    try {
      console.log(
        `Checking authorization for tokenId: ${tokenId}, wallet: ${wallet}`
      );
      const authorized = await isAuthorizedOrOwner(tokenId, wallet);
      console.log(`Authorization result: ${authorized}`);
      if (!authorized) {
        return jsonResponse({ error: "Not owner of authorized" }, 401);
      }

      console.log(`Getting encrypted URI for tokenId: ${tokenId}`);
      const encryptedURI = await getEncryptedURI(tokenId);
      console.log(`Encrypted URI: ${encryptedURI}`);

      console.log(`Fetching encrypted payload...`);
      const base64Payload = await fetchEncryptedPayload(encryptedURI);
      console.log(`Payload length: ${base64Payload.length}`);
      console.log(
        `Payload content (first 100 chars): ${base64Payload.substring(0, 100)}`
      );
      console.log(
        `Is valid base64?`,
        /^[A-Za-z0-9+/]*={0,2}$/.test(base64Payload)
      );

      console.log(`Attempting decryption...`);
      const plainText = await decryptAesGcmBase64(
        base64Payload,
        METADATA_SYM_KEY_BASE64
      );
      console.log(
        `Decryption successful, plaintext length: ${plainText.length}`
      );

      let metadata: JudgeMetadata;

      try {
        metadata = JSON.parse(plainText);
        console.log(`JSON parsing successful`);
      } catch (parseError) {
        console.error(`JSON parsing failed:`, parseError);
        return jsonResponse(
          {
            error: "Invalid metadata JSON after decryption",
          },
          400
        );
      }
      return jsonResponse({ metadata });
    } catch (error) {
      {
        console.error("Error processing metadata request:", error);

        if (error instanceof Error) {
          console.error("Error name:", error.name);
          console.error("Error message:", error.message);
        } else {
          console.error("Unknown error type:", typeof error);
        }

        return jsonResponse(
          {
            error: "Failed to process request",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  };

  const scoreHandler: RouteHandler = async (req) => {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");

    if (pathParts.length < 3 || pathParts[2] === "") {
      return jsonResponse({ error: "Invalid token ID format" }, 400);
    }

    const tokenId = Number(pathParts[2]);

    if (isNaN(tokenId) || tokenId < 0) {
      return jsonResponse(
        { error: "Invalid token ID: must be a positive number" },
        400
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const { wallet, submissionId, text, chosenProviderAddress } = body as {
      wallet: string;
      submissionId: string;
      text: string;
      chosenProviderAddress?: string;
    };

    if (!wallet || !submissionId || !text) {
      return jsonResponse({ error: "wallet, submissionId, text are required" });
    }

    try {
      const authorized = await isAuthorizedOrOwner(tokenId, wallet);

      if (!authorized) {
        return jsonResponse({ error: "Not owner or authorized" }, 401);
      }

      const encryptedURI = await getEncryptedURI(tokenId);
      const payload = await fetchEncryptedPayload(encryptedURI);
      const plainText = await decryptAesGcmBase64(
        payload,
        METADATA_SYM_KEY_BASE64
      );
      const metadata: JudgeMetadata = JSON.parse(plainText);

      const rubricText = metadata.rubric
        .map((r) => `-${r.criterion}(weight ${r.weight}`)
        .join("\n");

      const question = [
        metadata.prompts.system,
        "",
        "Submissions:",
        text,
        "",
        "Rubric:",
        rubricText,
        "",
        "Return JSON with fields: scores[{criterion, score, weight}], totalWeightedScore, justification",
      ].join("\n");

      let providerAddress = chosenProviderAddress;
      if (!providerAddress) {
        const services = await listServices();

        const preferred =
          services.find(
            (s: { model: string; provider: string }) =>
              s.model === (metadata.modelHint ?? "")
          ) ?? services[0];

        if (!preferred) {
          return jsonResponse(
            { error: "No inference services available" },
            400
          );
        }
        providerAddress = preferred.provider;
      }

      const inf = await runJudgingInference(providerAddress!, question);
      let parsed: {
        scores: Array<{ criterion: string; score: number; weight: number }>;
        totalWeightedScore: number;
        justification: string;
      } | null = null;
      try {
        parsed = JSON.parse(inf.answer);
      } catch {
        parsed = null;
      }

      const scores =
        parsed?.scores ??
        metadata.rubric.map((r) => ({
          criterion: r.criterion,
          score: 3,
          weight: r.weight,
        }));
      const totalWeightedScore =
        parsed?.totalWeightedScore ??
        metadata.rubric.reduce((acc, r) => acc + 3 * r.weight, 0);
      const justification = parsed?.justification ?? inf.answer;

      const scorecard: ScoreCard = {
        tokenId,
        submissionId,
        scores,
        totalWeightedScore,
        justification,
        provider: providerAddress!,
        model: inf.model,
        verified: inf.verified,
        createdAt: Date.now(),
      };
      return jsonResponse({ scorecard });
    } catch (error) {
      console.log("Error processing score request: ", error);
      return jsonResponse(
        {
          error: "Failed to process request",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  };

  const scorecardUploadHandler: RouteHandler = async (req) => {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");

    if (pathParts.length < 3 || pathParts[2] === "") {
      return jsonResponse({ error: "Invalid token ID format" }, 400);
    }

    const tokenId = Number(pathParts[2]);

    if (isNaN(tokenId) || tokenId < 0) {
      return jsonResponse(
        { error: "Invalid token ID: must be a positive number" },
        400
      );
    }

    try {
      const body = await req.json().catch(() => null);
      if (!body) {
        return jsonResponse({ error: "Invalid JSON body" }, 400);
      }

      const { scorecard } = body as { scorecard: ScoreCard };

      if (!scorecard || scorecard.tokenId !== tokenId) {
        return jsonResponse({ error: "Scorecard tokenId mismatch" }, 400);
      }

      const { rootHash, txHash } = await uploadJsonToStorage(scorecard);
      return jsonResponse({ rootHash, txHash });
    } catch (error) {
      console.error("Error processing scorecard upload:", error);
      return jsonResponse(
        {
          error: "Failed to process request",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  };
  registerRoute("/judge/services", servicesHandler);
  registerRoute("/judge/:tokenId/metadata", metadataHandler);
  registerRoute("/judge/:tokenId/score", scoreHandler);
  registerRoute("/judge/:tokenId/scorecard/upload", scorecardUploadHandler);
}
