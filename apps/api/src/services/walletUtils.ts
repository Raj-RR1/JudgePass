import { ethers } from "ethers";
import { OG_RPC_URL } from "../config";

export interface WalletInfo {
  address: string;
  signature: string;
  message: string;
}

export async function createWalletFromSignature(walletInfo: WalletInfo): Promise<ethers.Wallet> {
  const provider = new ethers.JsonRpcProvider(OG_RPC_URL);

  // Verify the signature
  const recoveredAddress = ethers.verifyMessage(walletInfo.message, walletInfo.signature);

  if (recoveredAddress.toLowerCase() !== walletInfo.address.toLowerCase()) {
    throw new Error("Invalid signature: recovered address does not match provided address");
  }
  
  // Create a wallet instance with a dummy private key since we only need the address
  // The actual signing will be done by the user's wallet in the frontend
  // We just need a wallet object with the correct address for the 0G services
  const dummyPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000001';
  const wallet = new ethers.Wallet(dummyPrivateKey, provider);
  
  // Override the address to match the verified address
  Object.defineProperty(wallet, 'address', {
    value: walletInfo.address,
    writable: false
  });

  return wallet;
}

export function createWalletFromAddress(address: string): ethers.Wallet {
  const provider = new ethers.JsonRpcProvider(OG_RPC_URL);
  return new ethers.Wallet(address, provider);
}