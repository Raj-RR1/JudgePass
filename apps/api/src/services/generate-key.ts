console.log(
  Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64")
);
