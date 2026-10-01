import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, StatusPill } from "@/components/admin-ui";
import { getAdminCustomers } from "@/lib/academy-queries";

export default async function StudentsPage() {
  const students = await getAdminCustomers();
  return <AdminShell active="/admin/students"><AdminHeader eyebrow="LMS / HỌC VIÊN" title="Học viên" description="Theo dõi quyền truy cập và tiến độ thật của từng học viên." /><section className="admin-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Học viên</th><th>Sản phẩm đã mở</th><th>Tiến độ</th><th>Hoạt động cuối</th><th>Trạng thái</th></tr></thead><tbody>{students.map(item => <tr key={item.id}><td><b>{item.name}</b><small className="table-subtext">{item.email}</small></td><td>{item.products}</td><td><div className="table-progress"><i><em style={{ width: `${item.progress}%` }} /></i><b>{item.progress}%</b></div></td><td>{item.lastActive}</td><td><StatusPill status={item.products ? item.progress === 100 ? "Hoàn thành" : "Đang học" : "Chờ thanh toán"} /></td></tr>)}{students.length === 0 && <tr><td colSpan={5}>Chưa có học viên.</td></tr>}</tbody></table></div></section></AdminShell>;
}
