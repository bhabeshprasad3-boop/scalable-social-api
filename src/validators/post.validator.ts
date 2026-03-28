import { z } from "zod";

export const createPostSchema = z.object({
  caption: z
    .string({ message: "Caption is required" })
    .trim()
    .min(1, "Caption cannot be empty")
    .max(2200, "Caption must not exceed 2200 characters"),
});
