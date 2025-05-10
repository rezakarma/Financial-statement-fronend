
export const encryptWithPublicKey = async (
    message: string,
    publicKeyPem: string
  ): Promise<string> => {
    try {
      // Convert PEM to SPKI format
      // Clean the PEM string
      const pemContents = publicKeyPem
        .replace(/-----BEGIN PUBLIC KEY-----/g, "")
        .replace(/-----END PUBLIC KEY-----/g, "")
        .replace(/\s+/g, "") // Remove all whitespace including newlines
        .trim();

      // Validate Base64 format
      if (!/^[A-Za-z0-9+/=]+$/.test(pemContents)) {
        throw new Error("Invalid Base64 characters in public key");
      }

      // Handle potential URL-safe Base64
      const normalizedBase64 = pemContents
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      // Add padding if needed
      const padLength = 4 - (normalizedBase64.length % 4);
      const paddedBase64 =
        normalizedBase64 + (padLength < 4 ? "=".repeat(padLength) : "");

      // Decode Base64
      const binaryDer = Uint8Array.from(atob(paddedBase64), (c) =>
        c.charCodeAt(0)
      );

      // Import public key
      const publicKey = await crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["encrypt"]
      );

      // Encrypt message
      const encodedMessage = new TextEncoder().encode(message);
      const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encodedMessage
      );

      // Convert to Base64
      return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  };