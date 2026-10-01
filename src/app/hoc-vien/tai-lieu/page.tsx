import { BookOpen, Download } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { getStudentDashboardData } from "@/lib/academy-queries";

export default async function ResourcesPage() {
  const data = await getStudentDashboardData();
  return <StudentShell active="/hoc-vien/tai-lieu" fullName={data?.fullName}><header className="student-header"><div><span>HỌC VIÊN / TÀI LIỆU</span><h1>Thư viện tài liệu.</h1><p>Worksheet và tài nguyên sẽ xuất hiện tại đây khi quản trị viên gắn vào bài học.</p></div></header><section className="student-section resource-grid"><article><BookOpen /><div><h3>Tài liệu theo bài học</h3><p>Mở một bài học đã được cấp quyền để tải worksheet tương ứng.</p></div><span><Download /> Được cập nhật tự động</span></article></section></StudentShell>;
}
