# JudgePass Smart Contracts

This directory contains the smart contracts for the JudgePass project, upgraded to Solidity v0.8.30.

## Contract Overview

### INFT.sol
The main Intelligent NFT contract that provides:
- ERC-721 functionality with encrypted metadata
- Owner-based minting
- Usage authorization system (lease-style permissions)
- Metadata rotation capabilities
- Encrypted URI and metadata hash storage

## Development Setup

This project uses [Foundry](https://book.getfoundry.sh/) for smart contract development.

### Prerequisites
- Foundry installed (run `foundryup` to install/update)

### Available Commands

From the project root:
```bash
# Build contracts
bun run contracts:build

# Run tests
bun run contracts:test

# Deploy to 0G testnet
bun run contracts:deploy
```

From the contracts directory:
```bash
# Build contracts
forge build

# Run tests
forge test

# Deploy to 0G testnet
forge script script/DeployINFT.s.sol --rpc-url 0g_testnet --broadcast --verify
```

## Contract Features

### Key Changes from v0.8.20 to v0.8.30
- Updated to Solidity compiler v0.8.30
- Updated OpenZeppelin contracts to v5.0.0
- Updated constructor syntax for Ownable (now requires initial owner parameter)
- All functionality remains the same

### Main Functions
- `mint(address to, string encryptedURI, bytes32 metadataHash)` - Mint new INFT (owner only)
- `authorizeUsage(uint256 tokenId, address executor, bytes permissions)` - Grant usage rights
- `revokeUsage(uint256 tokenId, address executor)` - Revoke usage rights
- `updateMetadata(uint256 tokenId, string newEncryptedURI, bytes32 newMetadataHash)` - Update metadata
- `getAuthorization(uint256 tokenId, address executor)` - Check authorization
- `getEncryptedURI(uint256 tokenId)` - Get encrypted metadata URI
- `getMetadataHash(uint256 tokenId)` - Get metadata hash

## Testing

The contract includes comprehensive tests covering:
- Basic minting functionality
- Usage authorization and revocation
- Metadata updates
- Access control (only owner can mint, only token owner can authorize)

## Deployment

The contract can be deployed to the 0G testnet using the provided deployment script. Make sure to set the `PRIVATE_KEY` environment variable before deployment.

## Integration

The contract is designed to work with the existing JudgePass API and web applications. The ABI and contract address should be updated in the API configuration after deployment.