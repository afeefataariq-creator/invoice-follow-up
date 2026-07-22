// This scrambles the user's Stripe key before we save it to the
// database, and unscrambles it only when we need to actually call
// Stripe. Even if our database were ever exposed, the key sitting in
// it would be useless without this secret, which only lives in our
// server's environment variables — never in the database itself.

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const secret = process.env.STRIPE_KEY_ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error("Missing STRIPE_KEY_ENCRYPTION_SECRET environment variable.");
  }
  return Buffer.from(secret, "hex");
}

export function encrypt(plainText: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedKey: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

export function decrypt(encryptedKey: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedKey, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
