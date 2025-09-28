# JudgePass Deployment Guide

## Overview

This guide covers deploying JudgePass to Vercel, including smart contracts, API, and web application.

## Prerequisites

- GitHub account
- Vercel account
- 0G testnet wallet with funds
- Node.js 18+ or Bun

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment with automatic builds and environment management.

#### Step 1: Fork Repository

1. Fork this repository to your GitHub account
2. Clone your fork locally

#### Step 2: Deploy Smart Contracts

1. **Set up Foundry** (if not already installed):
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   source ~/.bashrc
   foundryup
   ```

2. **Deploy contracts**:
   ```bash
   cd contracts
   export PRIVATE_KEY="your_funded_testnet_private_key"
   forge script script/DeployINFT.s.sol --rpc-url 0g_testnet --broadcast --verify
   ```

3. **Note the contract address** from the deployment output

#### Step 3: Deploy to Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your forked repository

2. **Configure build settings**:
   - Framework Preset: `Other`
   - Build Command: `bun run build:all`
   - Output Directory: `apps/web/dist`
   - Install Command: `bun install`

3. **Set environment variables**:
   ```
   OG_RPC_URL=https://evmrpc-testnet.0g.ai
   INDEXER_RPC=https://indexer-storage-testnet-turbo.0g.ai
   PRIVATE_KEY=your_funded_testnet_private_key
   INFT_CONTRACT_ADDRESS=your_deployed_contract_address
   METADATA_SYM_KEY_BASE64=your_base64_encryption_key
   PORT=3001
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

#### Step 4: Configure API Routes

Vercel will automatically detect and deploy API routes from the `apps/api` directory.

### Option 2: Manual Deployment

#### Deploy API Separately

1. **Build API**:
   ```bash
   cd apps/api
   bun install
   bun run build
   ```

2. **Deploy to your preferred platform**:
   - Railway
   - Render
   - DigitalOcean App Platform
   - AWS Lambda

#### Deploy Web App

1. **Build web app**:
   ```bash
   cd apps/web
   bun install
   bun run build
   ```

2. **Deploy to static hosting**:
   - Vercel (static)
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OG_RPC_URL` | 0G RPC endpoint | `https://evmrpc-testnet.0g.ai` |
| `INDEXER_RPC` | 0G Indexer endpoint | `https://indexer-storage-testnet-turbo.0g.ai` |
| `PRIVATE_KEY` | Funded wallet private key | `0x1234...` |
| `INFT_CONTRACT_ADDRESS` | Deployed INFT contract | `0x5678...` |
| `METADATA_SYM_KEY_BASE64` | Base64 encryption key | `SGVsbG8gV29ybGQ=` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3001` |
| `KV_URL` | Key-value store URL | - |
| `NODE_ENV` | Environment | `production` |

## Build Configuration

### Vercel Configuration

Create `vercel.json` in the project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/api/src/server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "apps/web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/api/src/server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "apps/web/dist/$1"
    }
  ],
  "env": {
    "OG_RPC_URL": "@og_rpc_url",
    "INDEXER_RPC": "@indexer_rpc",
    "PRIVATE_KEY": "@private_key",
    "INFT_CONTRACT_ADDRESS": "@inft_contract_address",
    "METADATA_SYM_KEY_BASE64": "@metadata_sym_key_base64"
  }
}
```

### Package.json Scripts

Update root `package.json`:

```json
{
  "scripts": {
    "build:all": "bun run build:api && bun run build:web",
    "build:api": "cd apps/api && bun run build",
    "build:web": "cd apps/web && bun run build",
    "dev": "concurrently \"bun run dev:api\" \"bun run dev:web\"",
    "dev:api": "cd apps/api && bun run dev",
    "dev:web": "cd apps/web && bun run dev",
    "contracts:build": "cd contracts && forge build",
    "contracts:test": "cd contracts && forge test",
    "contracts:deploy": "cd contracts && forge script script/DeployINFT.s.sol --rpc-url 0g_testnet --broadcast --verify"
  }
}
```

## Testing Deployment

### Health Check

Test API health:
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Contract Integration

Test contract integration:
```bash
curl "https://your-app.vercel.app/api/judge/1/metadata?wallet=0x..."
```

### Web App

Visit your deployed URL to test the web application.

## Monitoring

### Vercel Analytics

Enable Vercel Analytics for:
- Performance monitoring
- Error tracking
- Usage analytics

### Logs

Monitor logs in Vercel dashboard:
- Function logs
- Build logs
- Error logs

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values
   - Verify private key format

3. **Contract Issues**
   - Verify contract is deployed
   - Check contract address
   - Ensure wallet has sufficient funds

4. **API Errors**
   - Check 0G RPC connectivity
   - Verify contract ABI
   - Check wallet authorization

### Debug Commands

```bash
# Check contract deployment
cast code $CONTRACT_ADDRESS --rpc-url $OG_RPC_URL

# Test RPC connectivity
curl -X POST $OG_RPC_URL -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check API health
curl https://your-app.vercel.app/api/health
```

## Security Considerations

### Environment Variables
- Never commit private keys to version control
- Use Vercel's environment variable encryption
- Rotate keys regularly

### Contract Security
- Verify contract deployment
- Use multi-sig for production deployments
- Monitor contract events

### API Security
- Implement rate limiting
- Validate all inputs
- Use HTTPS only

## Scaling

### Performance Optimization
- Enable Vercel Edge Functions
- Use CDN for static assets
- Implement caching strategies

### Cost Optimization
- Monitor function execution time
- Optimize database queries
- Use appropriate instance sizes

## Maintenance

### Regular Tasks
- Update dependencies
- Monitor contract events
- Check API performance
- Review security logs

### Updates
- Deploy contract updates carefully
- Test in staging environment
- Use blue-green deployment for critical updates

## Support

For deployment issues:
1. Check Vercel documentation
2. Review project logs
3. Open GitHub issue
4. Contact support team
