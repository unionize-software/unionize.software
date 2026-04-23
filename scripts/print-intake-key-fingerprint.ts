import { computePublicKeyFingerprint } from "../lib/intake/publicKey";

function getArg(flag: string) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

function main() {
  const publicKey = getArg("--public-key") ?? process.env.NEXT_PUBLIC_INTAKE_PUBLIC_KEY_BASE64;

  if (!publicKey) {
    throw new Error("Provide --public-key or set NEXT_PUBLIC_INTAKE_PUBLIC_KEY_BASE64.");
  }

  console.log(computePublicKeyFingerprint(publicKey));
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : "Unable to compute fingerprint.");
  process.exit(1);
}

