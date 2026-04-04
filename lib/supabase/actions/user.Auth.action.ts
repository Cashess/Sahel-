"use server";
import { emailValidationSchema } from "@/lib/zodvalidations/form-validations";
import { createClient } from "../server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    const emailValidation = emailValidationSchema.safeParse({ email });

    if (!emailValidation.success) {
        return { error: "Invalid email address" };
    }

    const { error } = await supabase.auth.signInWithOtp({
        email: emailValidation.data.email,
        options: {
            shouldCreateUser: true,
        },
    });

    if (error) {
        console.log("Error logging in:", error);
        return { error: error.message };
    }

    // 🚨 THIS is what triggers navigation
    redirect(`/verify?email=${encodeURIComponent(emailValidation.data.email)}`);
}



export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email", // 'magiclink' also works if you configured it that way
  });

  if (error) {
    console.error("OTP verification failed:", error);
    return { error: error.message };
  }

  // ✅ OTP verified, revalidate home page so session-dependent UI updates
  revalidatePath("/");

  // Redirect user to home or dashboard
  redirect("/");
}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log("Error signing out:", error);
        return { error: error.message };
    }
    revalidatePath("/");
}