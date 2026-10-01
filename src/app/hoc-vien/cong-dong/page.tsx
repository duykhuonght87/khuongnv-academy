import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { getStudentDashboardData } from "@/lib/academy-queries";
import { createClient } from "@/lib/supabase/server";

export default async function CommunityPage() {
  const [data, supabase] = await Promise.all([getStudentDashboardData(), createClient()]);
  const { data: settings } = (await supabase?.from("site_settings").select("community_url").eq("id", "default").single()) ?? { data: null };
  return <StudentShell active="/hoc-vien/cong-dong" fullName={data?.fullName}><section className="locked-course"><Users /><span>CỘNG ĐỒNG KHƯƠNGNV</span><h1>Kết nối để cùng tiến bộ.</h1><p>{settings?.community_url ? "Tham gia không gian cộng đồng dành riêng cho học viên." : "Liên kết cộng đồng chính thức sẽ được quản trị viên cập nhật trong Cài đặt hệ thống."}</p>{settings?.community_url && <Link className="button button-primary" href={settings.community_url} target="_blank" rel="noreferrer">Mở cộng đồng <ArrowUpRight /></Link>}</section></StudentShell>;
}
