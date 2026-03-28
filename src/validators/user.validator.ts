import { z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .trim()
    .toLowerCase()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot be more than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

  email: z.string().trim().toLowerCase().email("Invalid email format"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email format"),

  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot be more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/)
    .toLowerCase()
    .optional(),

  bio: z
    .string()
    .trim()
    .min(5, "Bio must be at least 5 characters")
    .max(150, "Bio cannot be more than 150 characters")
    .optional(),
});
