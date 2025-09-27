export async function decryptAesGcmBase64(
  base64CipherText: string,
  base64Key: string
): Promise<string> {
  const cipherBytes = Uint8Array.from(Buffer.from(base64CipherText, "base64"));

  const keyBytes = Uint8Array.from(Buffer.from(base64Key, "base64"));

  if (cipherBytes.length < 12 + 16) throw new Error("Invalid ciphertext size");

  const iv = cipherBytes.slice(0, 12);
  const dataplusTag = cipherBytes.slice(12);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    {
      name: "AES-GCM",
    },
    false,
    ["decrypt"]
  );

  const plainText = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    dataplusTag
  );

  return Buffer.from(new Uint8Array(plainText)).toString("utf-8");
}

export async function encryptAesGcmBase64(
  plaintext: string,
  base64Key: string
): Promise<string> {
  // Generate a random 12-byte IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Convert the base64 key to bytes
  const keyBytes = Uint8Array.from(Buffer.from(base64Key, "base64"));

  // Import the key
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    {
      name: "AES-GCM",
    },
    false,
    ["encrypt"]
  );

  // Encrypt the data
  const plaintextBytes = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintextBytes
  );

  // Combine IV and ciphertext
  const result = new Uint8Array(iv.length + ciphertext.byteLength);
  result.set(iv);
  result.set(new Uint8Array(ciphertext), iv.length);

  // Return as base64
  return Buffer.from(result).toString("base64");
}
