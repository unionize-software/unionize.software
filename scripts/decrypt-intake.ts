import { promises as fs } from "node:fs";

import sodium from "libsodium-wrappers";

function getArg(flag: string) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

function decodeBase64(input: string) {
  return sodium.from_base64(input.trim(), sodium.base64_variants.ORIGINAL);
}

async function readCiphertext() {
  const inlineCiphertext = getArg("--ciphertext");

  if (inlineCiphertext) {
    return inlineCiphertext;
  }

  const filePath = getArg("--ciphertext-file");

  if (!filePath) {
    throw new Error("Provide --ciphertext or --ciphertext-file.");
  }

  return fs.readFile(filePath, "utf8");
}

async function readPrivateKeyBytes() {
  const privateKeyPath = getArg("--private-key");

  if (!privateKeyPath) {
    throw new Error("Provide --private-key /path/to/private-key");
  }

  const contents = (await fs.readFile(privateKeyPath, "utf8")).trim();

  try {
    const parsed = JSON.parse(contents) as { privateKey?: string };

    if (parsed.privateKey) {
      return decodeBase64(parsed.privateKey);
    }
  } catch {
    // Fall through to raw base64 parsing.
  }

  return decodeBase64(contents);
}

async function main() {
  await sodium.ready;

  const ciphertext = await readCiphertext();
  const privateKey = await readPrivateKeyBytes();
  const publicKey = sodium.crypto_scalarmult_base(privateKey);
  const decrypted = sodium.crypto_box_seal_open(decodeBase64(ciphertext), publicKey, privateKey);

  if (!decrypted) {
    throw new Error("Unable to decrypt ciphertext with the provided private key.");
  }

  console.log(sodium.to_string(decrypted));
}

main().catch((error) => {
  console.error(
    error instanceof Error
      ? error.message
      : "Decryption failed. Check the ciphertext and private key inputs.",
  );
  process.exit(1);
});
