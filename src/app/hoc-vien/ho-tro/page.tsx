import Link from "next/link";
import { CircleHelp, Mail } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { getStudentDashboardData } from "@/lib/academy-queries";
import { createClient } from "@/lib/supabase/server";

export default async function SupportPage() {
  const [data, supabase] = await Promise.all([getStudentDashboardData(), createClient()]);
  const { data: settings } = (await supabase?.from("site_settings").select("support_email").eq("id", "default").single()) ?? { data: null };
  const email = settings?.support_email ?? "support@khuongnv.academy";
  return <StudentShell active="/hoc-vien/ho-tro" fullName={data?.fullName}><section className="locked-course"><CircleHelp /><span>TRUNG TÂM HỖ TRỢ</span><h1>Chúng tôi có thể giúp gì?</h1><p>Gửi email kèm tên tài khoản, khóa học và ảnh chụp lỗi để được xử lý nhanh.</p><Link className="button button-primary" href={`mailto:${email}`}><Mail /> {email}</Link></section></StudentShell>;
}
