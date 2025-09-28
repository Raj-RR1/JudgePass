# JudgePass Smart Contracts Documentation

## Overview

JudgePass uses an Intelligent NFT (INFT) contract built on Solidity v0.8.30 with OpenZeppelin v5.0.0. The contract provides encrypted metadata storage, usage authorization, and access control for hackathon judging.

## Contract Architecture

### INFT.sol

The main contract that extends ERC-721 with additional functionality for judge metadata and authorization.

#### Key Features

- **ERC-721 Compliance**: Standard NFT functionality
- **Encrypted Metadata**: Stores encrypted judge configuration
- **Usage Authorization**: Lease-style permission system
- **Access Control**: Owner-based minting and metadata updates
- **Metadata Rotation**: Update judge configuration without transfer

## Contract Functions

### Minting

#### `mint(address to, string encryptedURI, bytes32 metadataHash)`
Mints a new INFT with encrypted metadata.

**Parameters:**
- `to`: Recipient address
- `encryptedURI`: Encrypted metadata URI (0G Storage or base64)
- `metadataHash`: Keccak256 hash of encrypted metadata

**Access:** Owner only

**Returns:** `uint256` - Token ID

**Events:**
- `MetadataUpdated(tokenId, metadataHash, encryptedURI)`

### Authorization System

#### `authorizeUsage(uint256 tokenId, address executor, bytes permissions)`
Grants usage rights to an executor with custom permissions.

**Parameters:**
- `tokenId`: INFT token ID
- `executor`: Address to grant permissions to
- `permissions`: Opaque permission data (JSON, expiry, etc.)

**Access:** Token owner only

**Events:**
- `UsageAuthorized(tokenId, executor, permissions)`

#### `revokeUsage(uint256 tokenId, address executor)`
Revokes usage rights for an executor.

**Parameters:**
- `tokenId`: INFT token ID
- `executor`: Address to revoke permissions from

**Access:** Token owner only

**Events:**
- `UsageRevoked(tokenId, executor)`

#### `getAuthorization(uint256 tokenId, address executor)`
Checks authorization status for an executor.

**Parameters:**
- `tokenId`: INFT token ID
- `executor`: Address to check

**Returns:** `bytes` - Permission data (empty if not authorized)

### Metadata Management

#### `updateMetadata(uint256 tokenId, string newEncryptedURI, bytes32 newMetadataHash)`
Updates encrypted metadata for a token.

**Parameters:**
- `tokenId`: INFT token ID
- `newEncryptedURI`: New encrypted metadata URI
- `newMetadataHash`: New metadata hash

**Access:** Token owner only

**Events:**
- `MetadataUpdated(tokenId, newMetadataHash, newEncryptedURI)`

### View Functions

#### `getMetadataHash(uint256 tokenId)`
Gets the metadata hash for a token.

**Returns:** `bytes32` - Keccak256 hash of encrypted metadata

#### `getEncryptedURI(uint256 tokenId)`
Gets the encrypted metadata URI for a token.

**Returns:** `string` - Encrypted metadata URI

## Events

### `MetadataUpdated(uint256 indexed tokenId, bytes32 newHash, string newEncryptedURI)`
Emitted when metadata is updated for a token.

### `UsageAuthorized(uint256 indexed tokenId, address indexed executor, bytes permissions)`
Emitted when usage is authorized for an executor.

### `UsageRevoked(uint256 indexed tokenId, address indexed executor)`
Emitted when usage is revoked for an executor.

## Security Considerations

### Access Control
- Only contract owner can mint new INFTs
- Only token owners can authorize/revoke usage
- Only token owners can update metadata

### Data Integrity
- Metadata hashes ensure data integrity
- Encrypted URIs protect sensitive judge configuration
- Authorization system prevents unauthorized access

### Reentrancy Protection
- Contract inherits `ReentrancyGuard` for protection
- All state-changing functions are protected

## Deployment

### Prerequisites
- Foundry installed
- Funded wallet on 0G testnet
- Environment variables set

### Deploy Script
```bash
# Set environment variables
export PRIVATE_KEY="your_private_key"

# Deploy to 0G testnet
forge script script/DeployINFT.s.sol --rpc-url 0g_testnet --broadcast --verify
```

### Contract Address
After deployment, update the `INFT_CONTRACT_ADDRESS` environment variable in your API configuration.

## Testing

### Run Tests
```bash
# Run all tests
forge test

# Run with verbose output
forge test -vvv

# Run specific test
forge test --match-test testMint
```

### Test Coverage
The contract includes comprehensive tests covering:
- Basic minting functionality
- Authorization system
- Metadata updates
- Access control
- Error conditions

## Integration

### API Integration
The contract integrates with the JudgePass API through:

1. **Metadata Access**: API checks ownership/authorization before serving judge metadata
2. **Usage Tracking**: API logs usage for authorized executors
3. **Event Monitoring**: API monitors contract events for real-time updates

### Frontend Integration
The web app integrates with the contract through:

1. **Wallet Connection**: Users connect wallets to access their INFTs
2. **Authorization Management**: UI for managing usage permissions
3. **Metadata Display**: Display of judge configuration and status

## Gas Optimization

### Optimizations Applied
- Packed structs where possible
- Efficient storage patterns
- Minimal external calls
- Optimized event emissions

### Gas Costs (Estimated)
- Mint: ~150,000 gas
- Authorize Usage: ~50,000 gas
- Revoke Usage: ~30,000 gas
- Update Metadata: ~60,000 gas

## Upgrade Path

### Current Version
- Solidity v0.8.30
- OpenZeppelin v5.0.0
- Foundry for development

### Future Considerations
- Proxy pattern for upgrades (if needed)
- Additional authorization mechanisms
- Enhanced metadata formats
- Cross-chain compatibility

## Troubleshooting

### Common Issues

1. **Minting Fails**
   - Check if caller is contract owner
   - Verify recipient address is valid
   - Ensure sufficient gas

2. **Authorization Issues**
   - Verify caller is token owner
   - Check executor address validity
   - Confirm token exists

3. **Metadata Access Denied**
   - Verify wallet is owner or authorized
   - Check authorization permissions
   - Confirm token exists

### Debug Commands
```bash
# Check contract state
cast call $CONTRACT_ADDRESS "ownerOf(uint256)" 1 --rpc-url $RPC_URL

# Check authorization
cast call $CONTRACT_ADDRESS "getAuthorization(uint256,address)" 1 $EXECUTOR --rpc-url $RPC_URL

# Get metadata hash
cast call $CONTRACT_ADDRESS "getMetadataHash(uint256)" 1 --rpc-url $RPC_URL
```

## License

The smart contracts are licensed under Apache-2.0. See the LICENSE file for details.
