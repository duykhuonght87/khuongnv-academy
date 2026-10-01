"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { MetricCard, StatusPill } from "@/components/admin-ui";
import { formatVnd, type OrderStatus } from "@/lib/admin-data";
import type { AdminOrder } from "@/lib/admin-queries";
import { createClient } from "@/lib/supabase/client";

const dbStatus: Record<OrderStatus, string> = { "Đã thanh toán": "paid", "Chờ thanh toán": "pending", "Thất bại": "failed", "Đã hoàn tiền": "refunded" };

export function OrdersManager({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const visible = useMemo(() => orders.filter(order => (`${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(query.toLowerCase())) && (filter === "all" || order.status === filter)), [orders, query, filter]);
  const paid = orders.filter(order => order.status === "Đã thanh toán");
  const pending = orders.filter(order => order.status === "Chờ thanh toán");
  const aov = paid.length ? Math.round(paid.reduce((sum, order) => sum + order.amount, 0) / paid.length) : 0;
  async function updateStatus(orderNumber: string, status: OrderStatus) {
    const previous = orders;
    setOrders(current => current.map(order => order.id === orderNumber ? { ...order, status } : order));
    const { error } = await createClient()!.from("orders").update({ status: dbStatus[status], updated_at: new Date().toISOString() }).eq("order_number", orderNumber);
    if (error) { setOrders(previous); setMessage(error.message); } else setMessage(`Đã cập nhật ${orderNumber}.`);
  }
  function exportCsv() {
    const rows = [["Mã đơn", "Khách hàng", "Sản phẩm", "Giá trị", "Trạng thái", "Thời gian"], ...visible.map(order => [order.id, order.customer, order.product, String(order.amount), order.status, order.createdAt])];
    const blob = new Blob(["\uFEFF" + rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = href; anchor.download = "don-hang.csv"; anchor.click(); URL.revokeObjectURL(href);
  }
  return <><section className="metrics-grid compact-metrics"><MetricCard label="TỔNG ĐƠN" value={String(orders.length)} delta="Dữ liệu thực" /><MetricCard label="ĐÃ THANH TOÁN" value={String(paid.length)} delta="Đơn hoàn tất" tone="mint" /><MetricCard label="CHỜ XỬ LÝ" value={String(pending.length)} tone="orange" /><MetricCard label="AOV" value={formatVnd(aov)} delta="Giá trị trung bình" tone="blue" /></section><div className="table-toolbar"><label><Search /><input aria-label="Tìm đơn hàng" placeholder="Tìm mã đơn hoặc khách hàng..." value={query} onChange={event => setQuery(event.target.value)} /></label><select aria-label="Lọc trạng thái" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">Tất cả trạng thái</option>{Object.keys(dbStatus).map(status => <option key={status}>{status}</option>)}</select><button onClick={exportCsv}><Download /> Xuất CSV</button></div>{message && <p className="form-message" role="status">{message}</p>}<section className="admin-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Giá trị</th><th>Thanh toán</th><th>Thời gian</th></tr></thead><tbody>{visible.map(order => <tr key={order.id}><td><b>{order.id}</b></td><td>{order.customer}</td><td>{order.product}</td><td><b>{formatVnd(order.amount)}</b></td><td><select aria-label={`Trạng thái ${order.id}`} value={order.status} onChange={event => updateStatus(order.id, event.target.value as OrderStatus)}>{Object.keys(dbStatus).map(status => <option key={status}>{status}</option>)}</select><StatusPill status={order.status} /></td><td>{order.createdAt}</td></tr>)}{visible.length === 0 && <tr><td colSpan={6}>Chưa có đơn hàng phù hợp.</td></tr>}</tbody></table></div></section></>;
}
