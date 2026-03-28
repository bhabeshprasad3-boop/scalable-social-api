import {z} from 'zod'


export const uploadSchema = z.object({
    name:z
    .string({ message: "Username is required" })
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot be more than 20 characters"),

    bio:z
    .string({ message: "Username is required" })
    .trim()
    .min(5, "Bio must be at least 5 characters")
    .max(150, "Bio cannot be more than 150 characters"),

    profileURI:z
    .string()
    .url("not valid url format")
    .optional()
})