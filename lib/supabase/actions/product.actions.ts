"use server"

import { ProductParams } from "@/constant.types";
import { createClient } from "../server"

export async function fetchProducts(
  retries = 3,
  delay = 500
): Promise<ProductParams[]> {
  const supabase = await createClient();

  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      throw error; // 👈 trigger retry
    }

    return products ?? [];

  } catch (error: any) {
    console.error(
      `❌ Products fetch error (attempt ${4 - retries}/3):`,
      error.message
    );

    // 🚫 If it's a schema/table issue, don't retry
    if (
      error?.code === "42P01" || // table doesn't exist
      error?.message?.includes("permission denied")
    ) {
      console.error("🚫 Critical DB issue — skipping retries");
      return [];
    }

    if (retries > 0) {
      // ⏳ wait before retry
      await new Promise((res) => setTimeout(res, delay));

      return fetchProducts(retries - 1, delay * 2); // 🔥 exponential backoff
    }

    console.error("💀 Final failure fetching products");
    return [];
  }
}

export async function fetchProductById(
  id: string,
  retries = 3,
  delay = 500 // ms
) {
  const supabase = await createClient();

  try {
    if (!id) {
      console.warn("⚠️ No product ID provided");
      return null;
    }

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error; // 👈 force retry
    }

    return product;

  } catch (error: any) {
    console.error(`❌ Fetch error (attempt ${4 - retries}/3):`, error.message);

    // 🚫 Don't retry if it's a real DB error (like invalid UUID)
    if (
      error?.code === "22P02" || // invalid UUID
      error?.details?.includes("invalid input")
    ) {
      console.error("🚫 Invalid ID — skipping retries");
      return null;
    }

    if (retries > 0) {
      // ⏳ wait before retry (simple backoff)
      await new Promise((res) => setTimeout(res, delay));

      return fetchProductById(id, retries - 1, delay * 2); // 🔥 exponential backoff
    }

    console.error("💀 Final failure after retries");
    return null;
  }
}