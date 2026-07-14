import { z } from "zod";

export const UserRegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password cannot exceed 100 characters"),
});

export const CertificateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  issuer: z.string().min(1, "Issuer is required").max(100, "Issuer cannot exceed 100 characters"),
  issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid issue date format",
  }),
  expirationDate: z.string().optional().nullable().refine((val) => {
    if (!val) return true;
    return !isNaN(Date.parse(val));
  }, {
    message: "Invalid expiration date format",
  }),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url("Invalid credential URL format").optional().nullable().or(z.literal("")),
  category: z.string().optional().nullable(),
  description: z.string().max(1000, "Description cannot exceed 1000 characters").optional().nullable(),
  isPublic: z.boolean().optional().default(false),
});
