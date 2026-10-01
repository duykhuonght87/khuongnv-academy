import { StudentShell } from "@/components/student-shell";
import { getStudentDashboardData } from "@/lib/academy-queries";
import { createClient } from "@/lib/supabase/server";
import { AccountForm } from "./account-form";

export default async function AccountPage() {
  const [data, supabase] = await Promise.all([getStudentDashboardData(), createClient()]);
  const { data: { user } } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  const { data: profile } = user ? await supabase!.from("profiles").select("full_name,phone").eq("id", user.id).single() : { data: null };
  return <StudentShell active="/hoc-vien/tai-khoan" fullName={data?.fullName}><header className="student-header"><div><span>HỌC VIÊN / TÀI KHOẢN</span><h1>Thông tin tài khoản.</h1><p>Cập nhật tên và số điện thoại dùng cho hỗ trợ học viên.</p></div></header><AccountForm email={user?.email ?? ""} initialName={profile?.full_name ?? ""} initialPhone={profile?.phone ?? ""} /></StudentShell>;
}
