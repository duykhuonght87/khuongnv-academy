import type { Metadata } from "next";
import { Download, Filter, Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, MetricCard, RowMenu, StatusPill } from "@/components/admin-ui";
import { formatVnd } from "@/lib/admin-data";
import { getAdminOrders } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Admin · Đơn hàng" };

export default async function OrdersPage() {
  const orders = await getAdminOrders();
  const paidOrders = orders.filter(order => order.status === "Đã thanh toán");
  const pendingOrders = orders.filter(order => order.status === "Chờ thanh toán");
  const aov = paidOrders.length ? Math.round(paidOrders.reduce((sum, order) => sum + order.amount, 0) / paidOrders.length) : 0;
  return <AdminShell active="/admin/orders">
    <AdminHeader eyebrow="BÁN HÀNG / ĐƠN HÀNG" title="Đơn hàng" description="Theo dõi thanh toán, hoàn tiền và giá trị giao dịch." action={<button className="button button-ghost"><Download /> Xuất CSV</button>} />
    <section className="metrics-grid compact-metrics"><MetricCard label="TỔNG ĐƠN" value={String(orders.length)} delta="Dữ liệu thực" /><MetricCard label="ĐÃ THANH TOÁN" value={String(paidOrders.length)} delta="Đơn hoàn tất" tone="mint" /><MetricCard label="CHỜ XỬ LÝ" value={String(pendingOrders.length)} tone="orange" /><MetricCard label="AOV" value={formatVnd(aov)} delta="Giá trị trung bình" tone="blue" /></section>
    <div className="table-toolbar"><label><Search /><input placeholder="Tìm mã đơn hoặc khách hàng..." /></label><button><Filter /> Trạng thái</button><select aria-label="Lọc trạng thái"><option>Tất cả trạng thái</option><option>Đã thanh toán</option><option>Chờ thanh toán</option><option>Đã hoàn tiền</option></select></div>
    <section className="admin-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Giá trị</th><th>Thanh toán</th><th>Thời gian</th><th /></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td><b>{order.id}</b></td><td>{order.customer}</td><td>{order.product}</td><td><b>{formatVnd(order.amount)}</b></td><td><StatusPill status={order.status} /></td><td>{order.createdAt}</td><td><RowMenu /></td></tr>)}{orders.length === 0 && <tr><td colSpan={7}>Chưa có đơn hàng thực tế.</td></tr>}</tbody></table></div></section>
  </AdminShell>;
}
