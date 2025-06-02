"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { notFound, useSearchParams, useRouter } from "next/navigation";
import { SET_COOKIE } from "@/constants/urls";
import http from "@/services/httpServices";
import axios from "axios";

const LoginForm = () => {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const encryptWithPublicKey = async (
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

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const encryptedUsername = await encryptWithPublicKey(
        values.userName,
        process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY!
      );
      const encryptedPassword = await encryptWithPublicKey(
        values.password,
        process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY!
      );

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedUsername,
          encryptedPassword,
        }),
      });
      // const response = await axios.post("/login", {
      //   encryptedUsername,
      //   encryptedPassword,
      // });

      if (!response.ok) return;

      const result = await response.json();

      if (!result.status) throw Error(result.message);

      if (result && result.data && result.data.uid) {
        const setCookie = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${SET_COOKIE}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              // Authorization: "Bearer " + result.token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: result.data.uid,
            }),
          }
        );

        if (!setCookie.ok) throw Error("خطایی رخ داده است");

        console.log("setCookie", setCookie);

        if (result.message && setCookie.ok) {
          toast.success(result.message);
        }

        // redirection
      }
      if (result.error) {
        throw Error(result.error);
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("NEXT_REDIRECT")) {
        // Re-throw the error to let Next.js handle the redirect
        throw error;
      }
      console.log(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("خطایی رخ داده است");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام کاربری:</FormLabel>
              <FormControl>
                <Input placeholder="نام کاربری" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>پسورد:</FormLabel>
              <FormControl>
                <Input placeholder="پسورد" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          ورود
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
