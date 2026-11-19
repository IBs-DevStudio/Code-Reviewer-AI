import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import { verifySignature } from "./verifySignature";

const secret = "test-secret";
const payload = JSON.stringify({ action: "opened", number: 1 });
const sign = (body: string, s = secret) =>
  "sha256=" + createHmac("sha256", s).update(body).digest("hex");

describe("verifySignature", () => {
  it("accepts a valid signature", () => {
    expect(verifySignature(payload, sign(payload), secret)).toBe(true);
  });

  it("rejects a tampered payload", () => {
    expect(verifySignature(payload + "x", sign(payload), secret)).toBe(false);
  });

  it("rejects a signature made with the wrong secret", () => {
    expect(verifySignature(payload, sign(payload, "wrong"), secret)).toBe(false);
  });

  it("rejects a missing signature", () => {
    expect(verifySignature(payload, null, secret)).toBe(false);
  });

  it("rejects a malformed signature without throwing", () => {
    expect(() => verifySignature(payload, "garbage", secret)).not.toThrow();
    expect(verifySignature(payload, "garbage", secret)).toBe(false);
  });

  it("fails closed when the secret is not configured", () => {
    expect(verifySignature(payload, sign(payload), undefined)).toBe(false);
  });
});