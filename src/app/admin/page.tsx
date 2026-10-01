import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, UserPlus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, MetricCard, RevenueChart, StatusPill } from "@/components/admin-ui";
import { formatVnd } from "@/lib/admin-data";
import { getAdminCounts, getAdminOrders, getDailyRevenueSeries, getRevenueMetrics } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Admin · Tổng quan" };

export default async function AdminOverviewPage() {
  const [orders, counts] = await Promise.all([getAdminOrders(), getAdminCounts()]);
  const revenue = getRevenueMetrics(orders);
  const revenueSeries = getDailyRevenueSeries(orders);
  const paidOrders = orders.filter(order => order.status === "Đã thanh toán").length;
  return <AdminShell>
    <AdminHeader eyebrow="ADMIN / TỔNG QUAN" title="Bức tranh kinh doanh hôm nay." description="Theo dõi doanh thu, khách hàng và hoạt động học tập trong một màn hình." action={<Link className="button button-primary" href="/admin/orders">Xem đơn hàng <ArrowUpRight /></Link>} />
    <section className="metrics-grid">
      <MetricCard label="DOANH THU HÔM NAY" value={formatVnd(revenue.today)} delta="Dữ liệu thực" />
      <MetricCard label="TỔNG DOANH THU" value={formatVnd(revenue.paidTotal)} delta="Đơn đã thanh toán" tone="mint" />
      <MetricCard label="TỔNG KHÁCH HÀNG" value={String(counts.customers)} delta="Tài khoản học viên" tone="blue" />
      <MetricCard label="TỔNG ĐƠN" value={String(orders.length)} delta="Dữ liệu mới nhất" tone="orange" />
      <MetricCard label="LƯỢT GHI DANH" value={String(counts.students)} delta="Quyền học hiện có" />
      <MetricCard label="AOV" value={formatVnd(revenue.aov)} delta="Giá trị đơn trung bình" tone="mint" />
    </section>
    <section className="admin-grid-main">
      <article className="admin-card revenue-card">
        <div className="admin-card-head"><div><span>DOANH THU</span><h2>7 ngày gần nhất</h2></div><Link className="text-link" href="/admin/revenue">Xem phân tích <ArrowUpRight /></Link></div>
        <RevenueChart data={revenueSeries} />
      </article>
      <article className="admin-card funnel-card">
        <div className="admin-card-head"><div><span>DỮ LIỆU THỰC</span><h2>Tổng hợp hệ thống</h2></div></div>
        <div className="funnel-list">
          <div><span>Khách hàng</span><b>{counts.customers}</b><i style={{ width: counts.customers ? "100%" : "0%" }} /></div>
          <div><span>Tổng đơn</span><b>{orders.length}</b><i style={{ width: orders.length ? "61%" : "0%" }} /></div>
          <div><span>Đã thanh toán</span><b>{paidOrders}</b><i style={{ width: paidOrders ? "34%" : "0%" }} /></div>
        </div>
        <div className="aov"><span>AOV</span><strong>{formatVnd(revenue.aov)}</strong><small>Giá trị đơn trung bình</small></div>
      </article>
    </section>
    <section className="admin-card recent-orders">
      <div className="admin-card-head"><div><span>GIAO DỊCH</span><h2>Đơn hàng gần đây</h2></div><Link href="/admin/orders">Tất cả đơn <ArrowUpRight /></Link></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Giá trị</th><th>Trạng thái</th><th>Thời gian</th></tr></thead><tbody>{orders.slice(0, 5).map(order => <tr key={order.id}><td><b>{order.id}</b></td><td>{order.customer}</td><td>{order.product}</td><td>{formatVnd(order.amount)}</td><td><StatusPill status={order.status} /></td><td>{order.createdAt}</td></tr>)}{orders.length === 0 && <tr><td colSpan={6}>Chưa có đơn hàng thực tế.</td></tr>}</tbody></table></div>
    </section>
    <div className="admin-quick-actions"><Link href="/admin/customers"><UserPlus /> Quản lý khách hàng</Link><Link href="/admin/products"><ShoppingBag /> Quản lý sản phẩm</Link></div>
  </AdminShell>;
}
