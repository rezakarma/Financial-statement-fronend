import { NextRequest, NextResponse } from "next/server";
const privateKey = process.env.RSA_PRIVATE_KEY!;
import crypto from "crypto";
import { GET_TOKEN } from "@/constants/urls";

const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const decryptRSA = (encryptedText: string): string => {
  try {
    const buffer = Buffer.from(encryptedText, "base64");
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      buffer
    );
    return decrypted.toString("utf8");
  } catch (error) {
    console.log(error);
    throw new Error("Decryption failed");
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userName = decryptRSA(body.encryptedUsername);
    const decryptedPassword = decryptRSA(body.encryptedPassword);
    const hashedPassword = hashPassword(decryptedPassword);
    console.log(userName, ' userName')
    console.log(hashedPassword, ' hashedPassword')
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${GET_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          password: hashedPassword,
        }),
      }
    );
    console.log(response, ' http://localhost:5270/');
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    }
    return NextResponse.json({ error: "An unknown error occurred" });
  }
}
