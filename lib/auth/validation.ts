import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  birthDate: z
    .string()
    .trim()
    .min(1, "Birth date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid birth date."),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .trim(),
});

export const signInSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required.").trim(),
});

export function isAtLeast18(birthDate: string, referenceDate = new Date()) {
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const today = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate()
    )
  );

  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birth.getUTCMonth();
  const dayDiff = today.getUTCDate() - birth.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 18;
}

export type AuthFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: {
    fullName?: string[];
    birthDate?: string[];
    email?: string[];
    password?: string[];
  };
};

export const initialAuthState: AuthFormState = {
  status: "idle",
  message: "",
};
