import type { Metadata } from "next";
import { CalendarDays, Download } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, MetricCard, RevenueChart } from "@/components/admin-ui";
import { formatVnd } from "@/lib/admin-data";
import { getAdminOrders, getDailyRevenueSeries, getRevenueMetrics } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Admin · Doanh thu" };

export default async function RevenuePage() {
  const orders = await getAdminOrders();
  const revenue = getRevenueMetrics(orders);
  const revenueSeries = getDailyRevenueSeries(orders);
  const paidCount = orders.filter(order => order.status === "Đã thanh toán").length;
  const failedCount = orders.filter(order => order.status === "Thất bại").length;
  const refundedCount = orders.filter(order => order.status === "Đã hoàn tiền").length;
  const settledCount = paidCount + failedCount + refundedCount;
  const percent = (count: number) => settledCount ? `${((count / settledCount) * 100).toFixed(1).replace(".", ",")}%` : "0%";
  return <AdminShell active="/admin/revenue">
    <AdminHeader eyebrow="TÀI CHÍNH / DOANH THU" title="Doanh thu" description="Phân tích dòng tiền theo thời gian và sản phẩm." action={<div className="header-actions"><button className="button button-ghost"><CalendarDays /> Hôm nay</button><button className="button button-ghost"><Download /> Báo cáo</button></div>} />
    <section className="metrics-grid compact-metrics"><MetricCard label="HÔM NAY" value={formatVnd(revenue.today)} delta="Dữ liệu thực" /><MetricCard label="7 NGÀY" value={formatVnd(revenue.sevenDays)} delta="Đã thanh toán" tone="mint" /><MetricCard label="THÁNG NÀY" value={formatVnd(revenue.month)} delta="Đã thanh toán" tone="blue" /><MetricCard label="HOÀN TIỀN" value={formatVnd(revenue.refunded)} delta="Dữ liệu thực" tone="orange" /></section>
    <section className="admin-card revenue-full"><div className="admin-card-head"><div><span>BIỂU ĐỒ DOANH THU</span><h2>7 ngày gần nhất</h2></div><div className="segmented"><button className="active">7 ngày</button><button>30 ngày</button><button>Tháng này</button></div></div><RevenueChart data={revenueSeries} /></section>
    <section className="admin-grid-main revenue-split"><article className="admin-card"><div className="admin-card-head"><div><span>TỔNG HỢP</span><h2>Doanh thu đã ghi nhận</h2></div></div><div className="product-revenue"><div><span>Tổng doanh thu</span><b>{formatVnd(revenue.paidTotal)}</b><i><em style={{ width: revenue.paidTotal ? "100%" : "0%" }} /></i></div><div><span>Giá trị đơn trung bình</span><b>{formatVnd(revenue.aov)}</b><i><em style={{ width: revenue.aov ? "60%" : "0%" }} /></i></div><div><span>Hoàn tiền</span><b>{formatVnd(revenue.refunded)}</b><i><em style={{ width: revenue.refunded ? "20%" : "0%" }} /></i></div></div></article><article className="admin-card"><div className="admin-card-head"><div><span>CHẤT LƯỢNG</span><h2>Chỉ số thanh toán</h2></div></div><div className="quality-list"><div><span>Tỷ lệ thành công</span><b>{percent(paidCount)}</b></div><div><span>Tỷ lệ hoàn tiền</span><b>{percent(refundedCount)}</b></div><div><span>Đơn thất bại</span><b>{percent(failedCount)}</b></div></div></article></section>
  </AdminShell>;
}
