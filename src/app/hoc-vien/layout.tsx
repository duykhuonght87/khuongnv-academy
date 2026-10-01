import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login?next=/hoc-vien");
  }
  return children;
}
