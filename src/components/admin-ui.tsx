import { ArrowDownRight, ArrowUpRight, MoreHorizontal } from "lucide-react";

export function AdminHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="admin-header"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}

export function MetricCard({ label, value, delta, tone = "lime" }: { label: string; value: string; delta?: string; tone?: "lime" | "mint" | "blue" | "orange" }) {
  const positive = !delta?.startsWith("-");
  return <article className={`metric-card ${tone}`}><span>{label}</span><strong>{value}</strong>{delta && <small className={positive ? "up" : "down"}>{positive ? <ArrowUpRight /> : <ArrowDownRight />}{delta}</small>}</article>;
}

export function RevenueChart({ compact = false, data }: { compact?: boolean; data?: Array<{ label: string; amount: number }> }) {
  const series = data ?? [
    { label: "25/09", amount: 980000 }, { label: "26/09", amount: 1600000 }, { label: "27/09", amount: 799000 },
    { label: "28/09", amount: 2400000 }, { label: "29/09", amount: 3200000 }, { label: "30/09", amount: 4000000 }, { label: "01/10", amount: 3800000 },
  ];
  const max = Math.max(...series.map(item => item.amount), 1);
  const compactAmount = (amount: number) => amount >= 1000000 ? `${(amount / 1000000).toFixed(1).replace(".0", "")}M` : amount >= 1000 ? `${Math.round(amount / 1000)}K` : String(amount);
  return <div className={`revenue-chart ${compact ? "compact" : ""}`}>
    <div className="chart-grid-lines"><i /><i /><i /><i /></div>
    <div className="chart-bars" style={{ gridTemplateColumns: `repeat(${series.length}, minmax(22px, 1fr))` }}>{series.map((item, index) => <div key={`${item.label}-${index}`}><span style={{ height: `${item.amount ? Math.max(8, Math.round(item.amount / max * 100)) : 2}%` }}><b>{compactAmount(item.amount)}</b></span><small>{series.length <= 10 || index % 5 === 0 || index === series.length - 1 ? item.label : ""}</small></div>)}</div>
  </div>;
}

export function StatusPill({ status }: { status: string }) {
  const statusClass = status === "Đã thanh toán" || status === "Đang bán" || status === "Hoàn thành" || status === "Chưa dùng" ? "success" : status === "Chờ thanh toán" || status === "Đang học" ? "pending" : status === "Đã hoàn tiền" || status === "Ẩn" ? "muted" : "danger";
  return <span className={`status-pill ${statusClass}`}>{status}</span>;
}

export function RowMenu() { return <button className="row-menu" aria-label="Mở thao tác"><MoreHorizontal /></button>; }
