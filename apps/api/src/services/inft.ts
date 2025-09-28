import { ethers } from "ethers";
import { OG_RPC_URL, INFT_CONTRACT_ADDRESS } from "../config";

const INFT_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getEncryptedURI(uint256 tokenId) view returns (string)",
  "function getMetadataHash(uint256 tokenId) view returns (bytes32)",
  "function getAuthorization(uint256 tokenId, address executor) view returns (bytes)",
  "function authorizeUsage(uint256 tokenId, address executor, bytes permissions)",
  "function revokeUsage(uint256 tokenId, address executor)",
  "function updateMetadata(uint256 tokenId, string newEncryptedURI, bytes32 newMetadataHash)",
  "function mint(address to, string encryptedURI, bytes32 metadataHash) returns (uint256)",
  "event MetadataUpdated(uint256 indexed tokenId, bytes32 newHash, string newEncryptedURI)",
  "event UsageAuthorized(uint256 indexed tokenId, address indexed executor, bytes permissions)",
  "event UsageRevoked(uint256 indexed tokenId, address indexed executor)",
];

const provider = new ethers.JsonRpcProvider(OG_RPC_URL);

export const inftContract = new ethers.Contract(
  INFT_CONTRACT_ADDRESS,
  INFT_ABI,
  provider
);

export async function isOwner(
  tokenId: number,
  walletAddress: string
): Promise<boolean> {
  const owner: string = await inftContract.ownerOf(tokenId);
  return owner.toLowerCase() === walletAddress.toLowerCase();
}

export async function getEncryptedURI(tokenId: number): Promise<string> {
  return inftContract.getEncryptedURI(tokenId);
}

export async function getMetadataHashHex(tokenId: number): Promise<string> {
  const hash: string = await inftContract.getMetadataHash(tokenId);
  return hash;
}

export async function isAuthorizedOrOwner(
  tokenId: number,
  walletAddress: string
): Promise<boolean> {
  // Check if the address is the owner
  const owner = await isOwner(tokenId, walletAddress);
  if (owner) return true;
  
  // Check if the address has authorization
  const authorization = await inftContract.getAuthorization(tokenId, walletAddress);
  return authorization.length > 0;
}

export async function getAuthorization(
  tokenId: number,
  executor: string
): Promise<string> {
  const authorization = await inftContract.getAuthorization(tokenId, executor);
  return authorization;
}

export async function authorizeUsage(
  tokenId: number,
  executor: string,
  permissions: string,
  signer: ethers.Wallet
): Promise<void> {
  const contractWithSigner = inftContract.connect(signer);
  const permissionsBytes = ethers.toUtf8Bytes(permissions);
  await contractWithSigner.authorizeUsage(tokenId, executor, permissionsBytes);
}

export async function revokeUsage(
  tokenId: number,
  executor: string,
  signer: ethers.Wallet
): Promise<void> {
  const contractWithSigner = inftContract.connect(signer);
  await contractWithSigner.revokeUsage(tokenId, executor);
}

export async function updateMetadata(
  tokenId: number,
  newEncryptedURI: string,
  newMetadataHash: string,
  signer: ethers.Wallet
): Promise<void> {
  const contractWithSigner = inftContract.connect(signer);
  await contractWithSigner.updateMetadata(tokenId, newEncryptedURI, newMetadataHash);
}
