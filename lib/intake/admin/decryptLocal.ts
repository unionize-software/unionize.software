import { promises as fs } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// libsodium-wrappers' ESM export does not ship its transitive ESM artifacts reliably in some setups.
// Requiring the CJS entry keeps local tooling stable.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sodium = require("libsodium-wrappers") as typeof import("libsodium-wrappers");

function decodeBase64(input: string) {
  return sodium.from_base64(input.trim(), sodium.base64_variants.ORIGINAL);
}

async function readPrivateKeyBytes(privateKeyPath: string) {
  const contents = (await fs.readFile(privateKeyPath, "utf8")).trim();

  try {
    const parsed = JSON.parse(contents) as { privateKey?: string };
    if (parsed.privateKey) {
      return decodeBase64(parsed.privateKey);
    }
  } catch {
    // fall through to raw base64 parsing
  }

  return decodeBase64(contents);
}

export async function decryptCiphertext(opts: { ciphertextBase64: string; privateKeyPath: string }) {
  await sodium.ready;
  const privateKey = await readPrivateKeyBytes(opts.privateKeyPath);
  const publicKey = sodium.crypto_scalarmult_base(privateKey);
  const decrypted = sodium.crypto_box_seal_open(decodeBase64(opts.ciphertextBase64), publicKey, privateKey);

  if (!decrypted) {
    throw new Error("Unable to decrypt ciphertext with the provided private key.");
  }

  return sodium.to_string(decrypted);
}
