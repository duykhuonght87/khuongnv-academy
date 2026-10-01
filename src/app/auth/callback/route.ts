import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    await supabase?.auth.exchangeCodeForSession(code);
  }
  const supabase = await createClient();
  const { data: { user } } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  const { data: profile } = user ? await supabase!.from("profiles").select("role").eq("id", user.id).single() : { data: null };
  return NextResponse.redirect(`${origin}${profile?.role === "admin" ? "/admin" : "/hoc-vien"}`);
}
