import { createHash } from "node:crypto";

type IntakePublicKeyMetadata = {
  keyId: string;
  fingerprint: string;
  rotatedAt: string | null;
};

export function getConfiguredIntakePublicKeyId() {
  return process.env.NEXT_PUBLIC_INTAKE_PUBLIC_KEY_ID?.trim() || null;
}

export function getConfiguredIntakePublicKeyBase64() {
  return process.env.NEXT_PUBLIC_INTAKE_PUBLIC_KEY_BASE64?.trim() || null;
}

export function computePublicKeyFingerprint(publicKeyBase64: string) {
  const publicKeyBytes = Buffer.from(publicKeyBase64, "base64");

  if (!publicKeyBytes.length) {
    throw new Error("Public key is empty or invalid.");
  }

  const digest = createHash("sha256").update(publicKeyBytes).digest("hex");
  return digest.match(/.{1,2}/g)?.join(":") ?? digest;
}

export function getPublicIntakeKeyMetadata(): IntakePublicKeyMetadata | null {
  const keyId = getConfiguredIntakePublicKeyId();
  const publicKeyBase64 = getConfiguredIntakePublicKeyBase64();

  if (!keyId || !publicKeyBase64) {
    return null;
  }

  return {
    keyId,
    fingerprint: computePublicKeyFingerprint(publicKeyBase64),
    rotatedAt: process.env.NEXT_PUBLIC_INTAKE_PUBLIC_KEY_ROTATED_AT?.trim() || null,
  };
}

