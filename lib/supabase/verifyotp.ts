"use server";
import { createClient } from "./server";
import { redirect } from "next/navigation";

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/"); // or dashboard
}