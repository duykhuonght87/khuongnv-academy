"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { MetricCard, RevenueChart } from "@/components/admin-ui";
import { formatVnd } from "@/lib/admin-data";
import type { AdminOrder } from "@/lib/admin-queries";

type Period = 7 | 30 | "month";

export function RevenueDashboard({ orders }: { orders: AdminOrder[] }) {
  const [period, setPeriod] = useState<Period>(7);
  const paid = orders.filter(order => order.status === "Đã thanh toán");
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
  const since = period === "month" ? monthStart : new Date(todayStart.getTime() - (period - 1) * 86400000);
  const filtered = paid.filter(order => order.createdAtIso && new Date(order.createdAtIso) >= since);
  const total = filtered.reduce((sum, order) => sum + order.amount, 0);
  const refunded = orders.filter(order => order.status === "Đã hoàn tiền").reduce((sum, order) => sum + order.amount, 0);
  const series = (() => {
    const days = period === "month" ? Math.max(1, todayStart.getDate()) : period;
    const formatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
    return Array.from({ length: days }, (_, index) => { const day = new Date(todayStart); day.setDate(day.getDate() - (days - 1 - index)); const label = formatter.format(day); return { label, amount: paid.reduce((sum, order) => order.createdAtIso && formatter.format(new Date(order.createdAtIso)) === label ? sum + order.amount : sum, 0) }; });
  })();
  function exportCsv() {
    const rows = [["Ngày", "Doanh thu"], ...series.map(item => [item.label, String(item.amount)])];
    const blob = new Blob(["\uFEFF" + rows.map(row => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" }); const href = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = href; anchor.download = "bao-cao-doanh-thu.csv"; anchor.click(); URL.revokeObjectURL(href);
  }
  return <><section className="metrics-grid compact-metrics"><MetricCard label="HÔM NAY" value={formatVnd(paid.filter(order => order.createdAtIso && new Date(order.createdAtIso) >= todayStart).reduce((sum, order) => sum + order.amount, 0))} delta="Dữ liệu thực" /><MetricCard label={period === "month" ? "THÁNG NÀY" : `${period} NGÀY`} value={formatVnd(total)} delta="Đã thanh toán" tone="mint" /><MetricCard label="AOV" value={formatVnd(filtered.length ? Math.round(total / filtered.length) : 0)} tone="blue" /><MetricCard label="HOÀN TIỀN" value={formatVnd(refunded)} tone="orange" /></section><section className="admin-card revenue-full"><div className="admin-card-head"><div><span>BIỂU ĐỒ DOANH THU</span><h2>{period === "month" ? "Tháng này" : `${period} ngày gần nhất`}</h2></div><div className="header-actions"><div className="segmented"><button className={period === 7 ? "active" : ""} onClick={() => setPeriod(7)}>7 ngày</button><button className={period === 30 ? "active" : ""} onClick={() => setPeriod(30)}>30 ngày</button><button className={period === "month" ? "active" : ""} onClick={() => setPeriod("month")}>Tháng này</button></div><button className="button button-ghost" onClick={exportCsv}><Download /> Báo cáo</button></div></div><RevenueChart data={series} /></section></>;
}
