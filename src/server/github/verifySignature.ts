import crypto from "crypto";

export function verifySignature(
  payload: string,
  signature: string | null,
  secret: string | undefined,
): boolean {
  if (!secret || !signature) return false;

  const digest =
    "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex");

  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}