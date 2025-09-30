// Extend the Window interface to include ethereum
// This must be at the top level of the file, not inside a function or block.
declare global {
    interface Window {
      ethereum?: any;
    }
  }

import { useAccount, useSignMessage } from "wagmi";
import { ethers } from "ethers";

export interface WalletInfo {
  address: string;
  signature: string;
  message: string;
}

export interface WalletSigner {
  address: string;
  signMessage: (message: string) => Promise<string>;
  signTypedData: (domain: any, types: any, value: any) => Promise<string>;
  getProvider: () => Promise<ethers.Provider>;
}

export function useWalletSigner(): WalletSigner | null {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  if (!isConnected || !address) {
    return null;
  }

  const signMessage = async (message: string): Promise<string> => {
    if (!signMessageAsync) {
      throw new Error("Wallet not connected");
    }
    return await signMessageAsync({ message });
  };

  const signTypedData = async (domain: any, types: any, value: any): Promise<string> => {
    // For now, we'll use signMessage for typed data
    // In a production app, you'd want to use useSignTypedData from wagmi
    const message = JSON.stringify({ domain, types, value });
    return await signMessage(message);
  };




  const getProvider = async (): Promise<ethers.Provider> => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      return new ethers.BrowserProvider(window.ethereum);
    }
    throw new Error("No wallet provider found");
  };

  return {
    address,
    signMessage,
    signTypedData,
    getProvider,
  };
}

// Utility function to create a signer from wallet provider
export async function createWalletSigner(): Promise<ethers.Wallet | null> {
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Create a wallet instance from the signer
    const address = await signer.getAddress();
    const wallet = new ethers.Wallet(address, provider);
    
    return wallet;
  } catch (error) {
    console.error("Failed to create wallet signer:", error);
    return null;
  }
}