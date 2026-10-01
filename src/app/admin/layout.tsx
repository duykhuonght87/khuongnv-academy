import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login?next=/admin");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") redirect("/hoc-vien");
  }
  return children;
}
