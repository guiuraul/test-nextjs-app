"use server";

import { redirect } from "next/navigation";

import {
  initialAuthState,
  isAtLeast18,
  signInSchema,
  signUpSchema,
  type AuthFormState,
} from "@/lib/auth/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildErrorState(
  message: string,
  fieldErrors?: AuthFormState["fieldErrors"]
): AuthFormState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

export async function signUpAction(
  prevState: AuthFormState = initialAuthState,
  formData: FormData
): Promise<AuthFormState> {
  void prevState;

  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    birthDate: formData.get("birthDate"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return buildErrorState(
      "Please fix the highlighted fields and try again.",
      {
        fullName: fieldErrors.fullName,
        birthDate: fieldErrors.birthDate,
        email: fieldErrors.email,
        password: fieldErrors.password,
      }
    );
  }

  if (!isAtLeast18(parsed.data.birthDate)) {
    return buildErrorState("You must be at least 18 years old to register.", {
      birthDate: ["You must be at least 18 years old to register."],
    });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        birth_date: parsed.data.birthDate,
      },
    },
  });

  if (error) {
    return buildErrorState(error.message);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return {
    status: "success",
    message:
      "Account created. Check your inbox for the verification link, then sign in.",
  };
}

export async function signInAction(
  prevState: AuthFormState = initialAuthState,
  formData: FormData
): Promise<AuthFormState> {
  void prevState;

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return buildErrorState(
      "Please fix the highlighted fields and try again.",
      {
        email: fieldErrors.email,
        password: fieldErrors.password,
      }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return buildErrorState(error.message);
  }

  return {
    status: "success",
    message: "Signed in successfully.",
  };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
