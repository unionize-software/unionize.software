export async function encryptIntakePayload(plaintext: string, publicKeyBase64: string) {
  const sodium = (await import("libsodium-wrappers")).default;
  await sodium.ready;

  const publicKey = sodium.from_base64(publicKeyBase64, sodium.base64_variants.ORIGINAL);

  if (publicKey.length !== sodium.crypto_box_PUBLICKEYBYTES) {
    throw new Error("Organizer public key is not valid.");
  }

  const ciphertext = sodium.crypto_box_seal(sodium.from_string(plaintext), publicKey);

  return sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL);
}
