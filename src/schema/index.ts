import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string(),
  password: z.string(),
});
