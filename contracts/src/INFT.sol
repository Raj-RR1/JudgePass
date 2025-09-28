// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title INFT (Intelligent NFT) – ERC-721 with encrypted metadata and authorized usage
 * @notice Minimal version without oracle-based transfer. Designed for demos where the INFT
 *         stays with the same owner or usage is granted via authorizeUsage().
 *
 * Features:
 * - Encrypted metadata per token (encryptedURI, metadataHash)
 * - Mint by contract owner (admin) to any recipient
 * - Owner of token can authorize usage for other wallets (lease-style)
 * - Read methods for backend access control and metadata retrieval
 * - Optional metadata rotation by token owner (no oracle)
 */
contract INFT is ERC721, Ownable, ReentrancyGuard {
    // Per-token encrypted metadata storage and integrity hash
    mapping(uint256 => bytes32) private _metadataHashes;   // Integrity hash (e.g., Merkle root) of encrypted payload
    mapping(uint256 => string)  private _encryptedURIs;    // Opaque pointer/blob to encrypted payload (e.g., 0G Storage URI or base64)

    // Authorized usage: owner can grant usage rights to executor (e.g., subscription/lease)
    mapping(uint256 => mapping(address => bytes)) private _authorizations;

    // Auto-increment tokenId
    uint256 private _nextTokenId = 1;

    // Events
    event MetadataUpdated(uint256 indexed tokenId, bytes32 newHash, string newEncryptedURI);
    event UsageAuthorized(uint256 indexed tokenId, address indexed executor, bytes permissions);
    event UsageRevoked(uint256 indexed tokenId, address indexed executor);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {}

    // --- Mint ---

    /**
     * @notice Mint a new INFT to `to` with initial encrypted data and hash.
     * @dev Only contract owner (admin) can mint in this minimal version.
     * @param to Recipient wallet
     * @param encryptedURI Opaque pointer/blob (e.g., 0G Storage URI or base64 payload)
     * @param metadataHash Integrity hash (bytes32) of the encrypted payload
     */
    function mint(address to, string calldata encryptedURI, bytes32 metadataHash)
        external
        onlyOwner
        returns (uint256)
    {
        require(to != address(0), "Invalid recipient");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _encryptedURIs[tokenId] = encryptedURI;
        _metadataHashes[tokenId] = metadataHash;
        emit MetadataUpdated(tokenId, metadataHash, encryptedURI);
        return tokenId;
    }

    // --- Authorized usage (lease) ---

    /**
     * @notice Token owner grants usage rights to `executor` with an opaque `permissions` blob.
     * @dev Example permissions could be JSON describing maxRequests, expiry, allowed operations, etc.
     * @param tokenId Token ID
     * @param executor Wallet granted usage rights
     * @param permissions Opaque metadata describing usage rules (format defined off-chain)
     */
    function authorizeUsage(uint256 tokenId, address executor, bytes calldata permissions) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(executor != address(0), "Invalid executor");
        _authorizations[tokenId][executor] = permissions;
        emit UsageAuthorized(tokenId, executor, permissions);
    }

    /**
     * @notice Revoke usage rights for `executor`.
     * @param tokenId Token ID
     * @param executor Wallet to revoke
     */
    function revokeUsage(uint256 tokenId, address executor) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        delete _authorizations[tokenId][executor];
        emit UsageRevoked(tokenId, executor);
    }

    /**
     * @notice Read the authorization blob (non-zero means authorized).
     * @param tokenId Token ID
     * @param executor Wallet to check
     * @return permissions Opaque blob. Empty means not authorized.
     */
    function getAuthorization(uint256 tokenId, address executor) external view returns (bytes memory permissions) {
        permissions = _authorizations[tokenId][executor];
    }

    // --- Metadata management (no oracle) ---

    /**
     * @notice Rotate/update encrypted metadata for a token (owner-only).
     * @dev Use this to change the judge configuration without transferring ownership.
     * @param tokenId Token ID
     * @param newEncryptedURI New encrypted payload pointer/blob
     * @param newMetadataHash New integrity hash of encrypted payload
     */
    function updateMetadata(uint256 tokenId, string calldata newEncryptedURI, bytes32 newMetadataHash) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _encryptedURIs[tokenId] = newEncryptedURI;
        _metadataHashes[tokenId] = newMetadataHash;
        emit MetadataUpdated(tokenId, newMetadataHash, newEncryptedURI);
    }

    // --- Getters ---

    function getMetadataHash(uint256 tokenId) external view returns (bytes32) {
        return _metadataHashes[tokenId];
    }

    function getEncryptedURI(uint256 tokenId) external view returns (string memory) {
        return _encryptedURIs[tokenId];
    }
}
