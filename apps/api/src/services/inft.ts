import { ethers } from "ethers";
import { OG_RPC_URL, INFT_CONTRACT_ADDRESS } from "../config";

const INFT_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getEncryptedURI(uint256 tokenId) view returns (string)",
  "function getMetadataHash(uint256 tokenId) view returns (bytes32)",
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
) {
  return isOwner(tokenId, walletAddress);
}
