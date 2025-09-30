# JudgePass — INFT‑powered hackathon judging 🎯

A portable "judge brain" packaged as an Intelligent NFT (INFT) that uses ETHGlobal‑style rubrics and stores immutable scorecards on 0G Storage.
Judging becomes transparent, auditable, and access‑controlled via INFT ownership and wallet signature verification. ✅

### Highlights

- ETHGlobal‑style rubric: Technical Innovation, User Experience, Business Potential.
- Real blockchain data: Contract metadata, wallet signatures, and 0G storage integration.
- Tamper‑proof audit: Merkle root hashes for every scorecard on 0G Storage.
- Portable & permissioned: Rules packaged inside an INFT; usage gated by wallet ownership. 🔐

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

- Loads encrypted judge metadata (rubric, prompts) from blockchain contract, accessible only to the INFT owner. 🔑
- Runs AI scoring via 0G Compute Network (with graceful fallback when services unavailable).
- Saves immutable scorecards (scores, justification, provider, verification flag) to 0G Storage and returns a root hash.
- Requires wallet signature verification for all operations to ensure proper authentication.
- Provides intelligent model selection for AI inference when multiple models are available.

---

### Why it matters

- Aligns with common ETHGlobal judging themes for consistent, fair evaluation.
- Transparent and auditable via TEE‑verified outputs and immutable root hashes.
- Portable: judge rules live inside an INFT, enabling cross‑event reuse with on‑chain gating.

---

### Core flows

- Judge/Organizer
  - Connect wallet → Load INFT judge → View rubric/prompt.
  - Browse submissions → Run AI judging with wallet signature.
  - Save scorecard(s) → Present root hash for audit.
  - All operations require wallet signature verification for security.

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

- Judge core (✅ Implemented)

  - GET /judge/:tokenId/metadata?wallet=0x… → Load rubric/prompt (access‑controlled)
  - GET /judge/services → Available AI providers (with intelligent model selection)
  - POST /judge/:tokenId/score → Run AI judge with wallet signature
  - POST /judge/:tokenId/scorecard/upload → Save scorecard (returns root hash)

- Health check (✅ Implemented)
  - GET /health → API status and timestamp

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

- Technical Innovation (40%), User Experience (30%), Business Potential (30%).
- Scores are returned as JSON; weighted total is computed and stored with a verification flag. 🧮

---

### Security & verification

- Wallet signature verification: all operations require valid wallet signatures for authentication.
- Storage integrity: every scorecard upload returns a Merkle root hash for tamper‑proof audit.
- Access control: metadata and judge execution are gated by INFT ownership and wallet verification. 🔒
- Real blockchain data: all operations use actual blockchain contract data instead of mock data.

---

### Notes

- AI inference: Uses 0G Compute Network with intelligent model selection (prefers reasoning models).
- Graceful fallback: When 0G compute services are unavailable, uses default scoring with informative messages.
- Provider transparency: scorecards include provider identity and verification status.
- Real blockchain integration: All operations use actual contract data and 0G storage.

---

### Local development tips

- Keep shared types/utilities in packages/shared to avoid duplication.
- Prefer typed ABIs with ethers v6 for safe reads (ownerOf, metadata getters).
- Validate local Merkle roots against uploaded artifacts during development. 🧪

---

### Roadmap

- Manual scoring mode: Allow judges to enter scores manually instead of AI inference.
- Ensemble scoring: Multi‑judge scoring with tier‑weighted aggregation.
- Submission management: Full submission CRUD operations.
- Dispute system: File and resolve disputes with scorecard references.
- Marketplace: Judge profiles and marketplace for listing/purchasing INFT judges.
- On‑chain attestations: Link scorecard root hashes to event IDs for provenance.

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

### Example workflows

- Single judge scoring (✅ Working)

  - Organizer connects wallet → Loads INFT judge → GET /judge/:tokenId/metadata → POST /judge/:tokenId/score → POST /judge/:tokenId/scorecard/upload → Share root hash.

- Manual scoring (🚧 Planned)
  - Judge enters scores manually → Calculate weighted total → Save scorecard to blockchain.

- Ensemble scoring (🚧 Planned)
  - Organizer selects multiple judges → Run parallel scoring → Aggregate results → Save combined scorecard.
