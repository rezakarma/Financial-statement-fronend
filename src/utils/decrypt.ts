// utils/decrypt.ts
import { createDecipheriv } from "crypto";

export function serverDecrypt(iv: number[], data: number[]) {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.ENCRYPTION_KEY!, "hex"),
    Buffer.from(iv)
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data)),
    decipher.final()
  ]);

  return new URLSearchParams(decrypted.toString("utf-8"));
}