import { AdminShell } from "@/components/admin-shell";
import { AdminHeader } from "@/components/admin-ui";

export default function SettingsPage() {
  return <AdminShell active="/admin/settings"><AdminHeader eyebrow="HỆ THỐNG / CÀI ĐẶT" title="Cài đặt" description="Thông tin thương hiệu và cấu hình mặc định." /><section className="admin-card settings-form"><label>Tên hệ thống<input defaultValue="KhươngNV Academy" /></label><label>Tagline<input defaultValue="Làm chủ ChatGPT — Đóng gói chuyên môn — Xây dựng Doanh nghiệp Một Người" /></label><label>Email hỗ trợ<input defaultValue="support@khuongnv.academy" /></label><button className="button button-primary">Lưu thay đổi</button></section></AdminShell>;
}
