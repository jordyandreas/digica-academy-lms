import { z } from "zod";

export type AuthFormMode = "login" | "register" | "forgot";

export const authFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export type AuthFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function authFormSchema(mode: AuthFormMode) {
  const email = z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .email("Enter a valid email.");

  if (mode === "forgot") {
    return z.object({
      fullName: z.string(),
      email,
      password: z.string(),
      confirmPassword: z.string(),
    });
  }

  if (mode === "login") {
    return z.object({
      fullName: z.string(),
      email,
      password: z.string().min(6, "Password must be at least 6 characters."),
      confirmPassword: z.string(),
    });
  }

  return z
    .object({
      fullName: z.string().trim().min(2, "Please enter your full name."),
      email,
      password: z.string().min(6, "Password must be at least 6 characters."),
      confirmPassword: z.string().min(1, "Confirm your password."),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });
}
