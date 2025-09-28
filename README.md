# JudgePass — INFT‑powered, verifiable hackathon judging 🎯

A portable "judge brain" packaged as an Intelligent NFT (INFT) that mirrors ETHGlobal‑style rubrics, runs TEE‑verified scoring, and stores immutable scorecards on 0G Storage.
Judging becomes transparent, auditable, and access‑controlled via INFT ownership or authorization. ✅

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/judgepass)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.30-blue.svg)](https://soliditylang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)

### Highlights

- ETHGlobal‑style rubric: Innovation, Technical Execution, Sponsor Integration, Utility & UX, Documentation & Demo.
- Verifiable compute: TEE‑verified inference with single‑use headers and attestations.
- Tamper‑proof audit: Merkle root hashes for every scorecard on 0G Storage.
- Portable & permissioned: Rules packaged inside an INFT; usage gated on‑chain. 🔐

---

### Table of contents

- Overview
- What it does
- Why it matters
- Core flows
- Tech stack
- API overview
- Setup
- INFT alignment
- Demo rubric
- Security & verification
- Notes
- Local development tips
- Roadmap
- License
- Acknowledgments

---

### Overview

JudgePass turns an INFT into a self‑contained, access‑controlled judge that organizers load to evaluate hackathon projects with verifiable inference and immutable scorecards.
It ensures consistent, auditable judging across events while respecting on‑chain ownership and authorization.

---

### What it does

- Loads encrypted judge metadata (rubric, prompts) from 0G Storage, accessible only to the INFT owner or authorized wallets. 🔑
- Runs scoring via 0G Compute using single‑use headers and TEE (TeeML) verification.
- Saves immutable scorecards (scores, justification, provider, verification flag) to 0G Storage and returns a root hash.
- Supports code judging through optional .zip uploads with structured summaries.
- Enables multi‑judge “ensemble” scoring with tier‑weighted aggregation and a dispute flow.
- Provides judge profiles (tier, price, traits) and a simple marketplace for listing/purchasing INFT judges. 🛒

---

### Why it matters

- Aligns with common ETHGlobal judging themes for consistent, fair evaluation.
- Transparent and auditable via TEE‑verified outputs and immutable root hashes.
- Portable: judge rules live inside an INFT, enabling cross‑event reuse with on‑chain gating.

---

### Core flows

- Hacker

  - Submit project (Title, Team, Links, Description, optional .zip).
  - View status and scorecard root hash.
  - File disputes referencing the root hash. ⚖️

- Judge/Organizer
  - Connect wallet → Load INFT judge → View rubric/prompt.
  - Browse submissions → Run single or ensemble judging.
  - Save scorecard(s) → Present root hash for audit.
  - Manage judge profile (tier, price, traits) and marketplace listings/purchases.
  - Transfer or authorize usage on‑chain (ERC‑7857‑aligned). 🔄

---

### Tech stack

- Backend: Bun + TypeScript

  - 0G Storage SDK: upload/download, Merkle roots
  - 0G Compute Broker: verifiable inference, TEE headers, response verification
  - Ethers v6: INFT contract reads (ownerOf, getEncryptedURI, getMetadataHash, optional authorization getter)

- Frontend: Any (Vite/React recommended), with wallet connect for organizer/judge and API calls.
- Monorepo: apps/api (backend), apps/web (frontend), packages/shared (types/util)

---

### API overview

- Judge core

  - GET /judge/:tokenId/metadata?wallet=0x… → Load rubric/prompt (access‑controlled)
  - GET /judge/services → Available verifiable LLM providers
  - POST /judge/:tokenId/score → Run single judge
  - POST /judge/:tokenId/scorecard/upload → Save scorecard (returns root hash)

- Ensemble

  - POST /judge/ensemble/score → Multi‑judge by tokenIds/traits (tier‑weighted)
  - POST /judge/ensemble/save → Save combined scorecard

- Submissions

  - POST /submissions → Text‑only
  - POST /submissions/zip (multipart) → With .zip; stores root hash + summary
  - GET /submissions, GET /submissions/:id

- Disputes

  - POST /disputes → File dispute (submissionId + rootHash)
  - GET /disputes, POST /disputes/:id/resolve

- Profiles & Marketplace
  - GET/POST /judges/:tokenId → Tier, price, traits
  - GET /judges, GET /judges/ranked
  - GET/POST /marketplace/listings, POST /marketplace/listings/:id/purchase

---

### Setup

1. Repo and workspaces

- Monorepo with Bun workspaces: apps/_, packages/_
- apps/api: Bun server and routes
- apps/web: frontend (UI)

2. Environment

- OG_RPC_URL: https://evmrpc-testnet.0g.ai
- INDEXER_RPC: https://indexer-storage-testnet-turbo.0g.ai
- PRIVATE_KEY: funded on 0G‑Galileo Testnet (use a faucet) 🚰
- INFT_CONTRACT_ADDRESS: deployed INFT address
- METADATA_SYM_KEY_BASE64: demo key for decrypting judge metadata (replace with sealed‑key flow)

3. Run

- bun install
- apps/api: bun run src/server.ts
- apps/web: start the frontend dev server

---

### INFT alignment (ERC‑7857)

- Store encrypted judge configuration in 0G Storage.
- Gate access by on‑chain ownerOf or authorizeUsage (optional getter for backend checks).
- Ownership transfer updates metadata access; UI guides on‑chain transfer and storage access sync.

---

### Demo rubric (ETHGlobal‑style)

- Innovation (25), Technical Execution (25), Sponsor Integration (20), Utility & UX (20), Documentation & Demo (10).
- Scores are returned as JSON; weighted total is computed and stored with a verification flag. 🧮

---

### Security & verification

- TEE verification: show “Verified (TEE)” only when the broker attestation is valid.
- Storage integrity: every scorecard upload returns a Merkle root hash for tamper‑proof audit.
- Access control: metadata and judge execution are gated by INFT ownership/authorization. 🔒

---

### Notes

- Code zips: enforced size/type; prompts include brief tree + key files (truncated) for summarization.
- Provider transparency: scorecards include provider identity and verification status.
- Ensemble scoring: tier‑weighted averages with justification aggregation.

---

### Local development tips

- Keep shared types/utilities in packages/shared to avoid duplication.
- Prefer typed ABIs with ethers v6 for safe reads (ownerOf, metadata getters).
- Validate local Merkle roots against uploaded artifacts during development. 🧪

---

### Roadmap

- On‑chain attestations linking scorecard root hashes to event IDs for provenance.
- Richer marketplace filters (traits, pricing, models, verification modes).
- Templated dispute resolution with signed resolution artifacts and audit trails.

---

### Contributing

- Issues and PRs are welcome.
- Please follow conventional commits and include relevant tests for API changes.
- Add/update API docs and examples when endpoints change. 🙌

---

### License

- Apache‑2.0 (recommended) or MIT for ultra‑simple reuse.

---

### Acknowledgments

- Built on 0G: Storage, Compute, Chain (EVM), and DA.
- Inspired by ETHGlobal judging practices and criteria. 🚀

---

### Quickstart snippet

```bash
# 1) Install
bun install

# 2) Set environment
export OG_RPC_URL="https://evmrpc-testnet.0g.ai"
export INDEXER_RPC="https://indexer-storage-testnet-turbo.0g.ai"
export PRIVATE_KEY="0xYOUR_FUNDED_TESTNET_KEY"
export INFT_CONTRACT_ADDRESS="0xYOUR_INFT_ADDRESS"
export METADATA_SYM_KEY_BASE64="BASE64_DEMO_KEY"

# 3) Run API
cd apps/api
bun run src/server.ts

# 4) Run Web
cd ../web
bun run dev
```

---

### Deployment

#### Vercel Deployment (Recommended)

1. **Fork this repository** and connect it to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```
   OG_RPC_URL=https://evmrpc-testnet.0g.ai
   INDEXER_RPC=https://indexer-storage-testnet-turbo.0g.ai
   PRIVATE_KEY=your_funded_testnet_key
   INFT_CONTRACT_ADDRESS=your_inft_address
   METADATA_SYM_KEY_BASE64=your_base64_key
   ```
3. **Deploy** - Vercel will automatically build and deploy both API and web apps

#### Manual Deployment

```bash
# Build contracts
bun run contracts:build

# Test contracts
bun run contracts:test

# Deploy contracts (optional)
bun run contracts:deploy

# Build web app
cd apps/web && bun run build

# Deploy API
cd apps/api && bun run build
```

#### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OG_RPC_URL` | 0G RPC endpoint | ✅ |
| `INDEXER_RPC` | 0G Indexer endpoint | ✅ |
| `PRIVATE_KEY` | Funded wallet private key | ✅ |
| `INFT_CONTRACT_ADDRESS` | Deployed INFT contract address | ✅ |
| `METADATA_SYM_KEY_BASE64` | Base64 encoded encryption key | ✅ |
| `PORT` | API server port (default: 3001) | ❌ |
| `KV_URL` | Key-value store URL (optional) | ❌ |

---

### Example workflows

- Single judge scoring

  - Organizer connects wallet → Loads INFT judge → GET /judge/:tokenId/metadata → POST /judge/:tokenId/score → POST /judge/:tokenId/scorecard/upload → Share root hash.

- Ensemble scoring

  - Organizer selects multiple judges (tokenIds/traits) → POST /judge/ensemble/score → Review weighted output → POST /judge/ensemble/save → Share combined root hash.

- Dispute handling
  - Hacker submits dispute with submissionId + rootHash → Organizer reviews artifacts and TEE attestation → Resolve with signed outcome. 📝
