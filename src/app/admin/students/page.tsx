import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, StatusPill } from "@/components/admin-ui";
import { customers } from "@/lib/admin-data";

export default function StudentsPage() {
  return <AdminShell active="/admin/students"><AdminHeader eyebrow="LMS / HỌC VIÊN" title="Học viên" description="Theo dõi quyền truy cập và tiến độ của từng học viên." /><section className="admin-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Học viên</th><th>Khóa đang học</th><th>Tiến độ</th><th>Hoạt động cuối</th><th>Trạng thái</th></tr></thead><tbody>{customers.map((item, index) => <tr key={item.id}><td><b>{item.name}</b><small className="table-subtext">{item.email}</small></td><td>{index % 2 ? "Đóng gói chuyên môn" : "Làm chủ ChatGPT"}</td><td><div className="table-progress"><i><em style={{ width: `${item.progress}%` }} /></i><b>{item.progress}%</b></div></td><td>{item.lastActive}</td><td><StatusPill status={item.progress === 100 ? "Hoàn thành" : "Đang học"} /></td></tr>)}</tbody></table></div></section></AdminShell>;
}
