# JudgePass API Documentation

## Overview

The JudgePass API provides endpoints for managing INFT-powered hackathon judging, including judge metadata access, scoring, submissions, and disputes.

## Base URL

```
https://your-api-domain.vercel.app/api
```

## Authentication

Most endpoints require wallet-based authentication through the INFT ownership or authorization system.

## Endpoints

### Judge Core

#### Get Judge Metadata
```http
GET /judge/:tokenId/metadata?wallet=0x...
```

**Parameters:**
- `tokenId` (path): INFT token ID
- `wallet` (query): Wallet address for access control

**Response:**
```json
{
  "rubric": [
    {
      "criterion": "Technical Innovation",
      "weight": 0.4,
      "description": "Evaluates the innovative use of technology"
    }
  ],
  "prompts": {
    "system": "You are an expert judge..."
  }
}
```

#### Get Available Services
```http
GET /judge/services
```

**Response:**
```json
{
  "services": [
    {
      "id": "teeml",
      "name": "TeeML",
      "description": "TEE-verified inference",
      "verified": true
    }
  ]
}
```

#### Run Single Judge Scoring
```http
POST /judge/:tokenId/score
```

**Body:**
```json
{
  "submission": {
    "title": "Project Title",
    "description": "Project description",
    "team": "Team Name",
    "links": ["https://github.com/..."]
  },
  "service": "teeml"
}
```

**Response:**
```json
{
  "scores": {
    "Technical Innovation": 4,
    "User Experience": 3,
    "Business Potential": 4
  },
  "totalScore": 3.7,
  "justification": "Detailed scoring explanation...",
  "verified": true,
  "provider": "teeml"
}
```

#### Upload Scorecard
```http
POST /judge/:tokenId/scorecard/upload
```

**Body:**
```json
{
  "submissionId": "sub_123",
  "scores": {...},
  "justification": "...",
  "provider": "teeml",
  "verified": true
}
```

**Response:**
```json
{
  "rootHash": "0x1234...",
  "txHash": "0x5678...",
  "scorecardId": "sc_123"
}
```

### Ensemble Scoring

#### Run Ensemble Scoring
```http
POST /judge/ensemble/score
```

**Body:**
```json
{
  "tokenIds": [1, 2, 3],
  "submission": {...},
  "weights": {
    "1": 0.4,
    "2": 0.3,
    "3": 0.3
  }
}
```

**Response:**
```json
{
  "ensembleScore": 3.8,
  "individualScores": [
    {
      "tokenId": 1,
      "score": 3.7,
      "weight": 0.4
    }
  ],
  "aggregatedJustification": "..."
}
```

#### Save Ensemble Scorecard
```http
POST /judge/ensemble/save
```

**Body:**
```json
{
  "submissionId": "sub_123",
  "ensembleScore": 3.8,
  "individualScores": [...],
  "aggregatedJustification": "..."
}
```

### Submissions

#### Create Text Submission
```http
POST /submissions
```

**Body:**
```json
{
  "title": "Project Title",
  "description": "Project description",
  "team": "Team Name",
  "links": ["https://github.com/..."]
}
```

**Response:**
```json
{
  "id": "sub_123",
  "title": "Project Title",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Create Submission with Code
```http
POST /submissions/zip
Content-Type: multipart/form-data
```

**Form Data:**
- `submission`: JSON string with submission data
- `file`: ZIP file containing project code

**Response:**
```json
{
  "id": "sub_123",
  "title": "Project Title",
  "status": "pending",
  "codeHash": "0x1234...",
  "summary": "Code analysis summary...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Get Submissions
```http
GET /submissions
```

**Response:**
```json
{
  "submissions": [
    {
      "id": "sub_123",
      "title": "Project Title",
      "status": "scored",
      "score": 3.7,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Submission Details
```http
GET /submissions/:id
```

**Response:**
```json
{
  "id": "sub_123",
  "title": "Project Title",
  "description": "Project description",
  "team": "Team Name",
  "links": ["https://github.com/..."],
  "status": "scored",
  "score": 3.7,
  "scorecardHash": "0x1234...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Disputes

#### Create Dispute
```http
POST /disputes
```

**Body:**
```json
{
  "submissionId": "sub_123",
  "rootHash": "0x1234...",
  "reason": "Dispute reason",
  "evidence": "Supporting evidence"
}
```

**Response:**
```json
{
  "id": "disp_123",
  "submissionId": "sub_123",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Get Disputes
```http
GET /disputes
```

**Response:**
```json
{
  "disputes": [
    {
      "id": "disp_123",
      "submissionId": "sub_123",
      "status": "pending",
      "reason": "Dispute reason",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Resolve Dispute
```http
POST /disputes/:id/resolve
```

**Body:**
```json
{
  "resolution": "approved",
  "notes": "Resolution notes"
}
```

### Judge Profiles & Marketplace

#### Get Judge Profile
```http
GET /judges/:tokenId
```

**Response:**
```json
{
  "tokenId": 1,
  "tier": "expert",
  "price": "0.1",
  "traits": {
    "specialization": "DeFi",
    "experience": "5+ years"
  },
  "verified": true
}
```

#### Update Judge Profile
```http
POST /judges/:tokenId
```

**Body:**
```json
{
  "tier": "expert",
  "price": "0.1",
  "traits": {
    "specialization": "DeFi",
    "experience": "5+ years"
  }
}
```

#### Get All Judges
```http
GET /judges
```

**Response:**
```json
{
  "judges": [
    {
      "tokenId": 1,
      "tier": "expert",
      "price": "0.1",
      "verified": true
    }
  ]
}
```

#### Get Ranked Judges
```http
GET /judges/ranked
```

**Response:**
```json
{
  "judges": [
    {
      "tokenId": 1,
      "tier": "expert",
      "price": "0.1",
      "rating": 4.8,
      "totalJudgments": 150
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common Error Codes

- `UNAUTHORIZED`: Wallet not authorized to access judge metadata
- `INVALID_TOKEN_ID`: Invalid INFT token ID
- `SUBMISSION_NOT_FOUND`: Submission not found
- `DISPUTE_NOT_FOUND`: Dispute not found
- `INVALID_SERVICE`: Invalid scoring service
- `VERIFICATION_FAILED`: TEE verification failed
- `STORAGE_ERROR`: 0G Storage operation failed

## Rate Limits

- Judge scoring: 10 requests per minute per wallet
- Submissions: 5 requests per minute per IP
- General API: 100 requests per minute per IP

## Webhooks

JudgePass supports webhooks for the following events:

- `submission.created`
- `submission.scored`
- `dispute.created`
- `dispute.resolved`

Configure webhooks in your judge profile settings.
