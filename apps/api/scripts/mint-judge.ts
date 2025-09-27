import { ethers } from "ethers";
import {
  OG_RPC_URL,
  PRIVATE_KEY,
  INFT_CONTRACT_ADDRESS,
  METADATA_SYM_KEY_BASE64,
} from "../src/config";
import { uploadJsonToStorage } from "../src/services/storage";
import { encryptAesGcmBase64 } from "../src/services/crypto";

const demoJudgeMetadata = {
  rubric: [
    {
      criterion: "Technical Innovation",
      weight: 0.4,
      description:
        "Evaluates the innovative use of technology and technical complexity",
    },
    {
      criterion: "User Experience",
      weight: 0.3,
      description:
        "Assesses the usability, design, and overall user experience",
    },
    {
      criterion: "Business Potential",
      weight: 0.3,
      description: "Evaluates market fit, scalability, and business viability",
    },
  ],
  prompts: {
    system:
      "You are an expert judge evaluating hackathon projects. Analyze submissions based on the provided rubric, giving scores from 1-5 where 1 is poor and 5 is excellent. Provide detailed justification for each score.",
  },
};

async function mintJudgeNFT() {
  try {
    const provider = new ethers.JsonRpcProvider(OG_RPC_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    const contractABI = [
      "function mint(address to, string calldata encryptedURI, bytes32 metadataHash) external returns (uint256)",
      "event MetadataUpdated(uint256 indexed tokenId, bytes32 newHash, string newEncryptedURI)",
    ];

    const inftContract = new ethers.Contract(
      INFT_CONTRACT_ADDRESS,
      contractABI,
      signer
    );
    console.log("Encrypting metadata...");
    const metadataString = JSON.stringify(demoJudgeMetadata);
    const encryptedMetadata = await encryptAesGcmBase64(
      metadataString,
      METADATA_SYM_KEY_BASE64
    );

    const metadataHash = ethers.keccak256(
      ethers.toUtf8Bytes(encryptedMetadata)
    );
    const { rootHash, txHash } = await uploadJsonToStorage(encryptedMetadata);

    console.log("Minting NFT...");
    const mintTx = await inftContract.mint(
      await signer.getAddress(),
      encryptedMetadata,
      metadataHash
    );

    const receipt = await mintTx.wait();

    const eventFragment = inftContract.interface.getEvent("MetadataUpdated");
    const eventTopic = eventFragment?.topicHash;

    const event = receipt.logs.find((log: any) => log.topics[0] === eventTopic);

    if (event) {
      const tokenId = ethers.getBigInt(event.topics[1]);
      console.log(`Successfully minted Judge NFT with ID: ${tokenId}`);
      console.log(`Encrypted data length: ${encryptedMetadata.length}`);
      console.log(`Metadata Hash: ${metadataHash}`);
    }
  } catch (error) {
    console.error("Error minting Judge NFT:", error);
    throw error;
  }
}
mintJudgeNFT().catch(console.error);
