import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fetchUserOrders } from "@/lib/supabase/actions/order.actions";
import AdminProfile from "@/components/profile/AdminProfile";
import UserProfile from "@/components/profile/UserProfile";

const ADMIN_EMAIL = "aminugotie42@gmail.com";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  const isAdmin = user.email === ADMIN_EMAIL;

  if (isAdmin) {
    // Admin: fetch ALL orders, reviews, users
    const { data: allOrders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: allReviews } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: allUsers } = await supabase
      .from("users") // adjust if your users table is named differently
      .select("*");

    return (
      <AdminProfile
        orders={allOrders || []}
        reviews={allReviews || []}
        users={allUsers || []}
        adminEmail={user.email!}
      />
    );
  }

  // Regular user: fetch only their orders and reviews
  const userOrders = await fetchUserOrders();

  const { data: userReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <UserProfile
      orders={userOrders}
      reviews={userReviews || []}
      userEmail={user.email!}
    />
  );
}
