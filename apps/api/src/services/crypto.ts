export async function decryptAesGcmBase64(
  base64CipherText: string,
  base64Key: string
): Promise<string> {
  const cipherBytes = Uint8Array.from(Buffer.from(base64CipherText, "base64"));

  const keyBytes = Uint8Array.from(Buffer.from(base64CipherText, "base64"));

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
