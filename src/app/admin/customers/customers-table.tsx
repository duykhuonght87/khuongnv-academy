"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import type { AdminCustomer } from "@/lib/academy-types";
import { formatVnd } from "@/lib/admin-data";

export function CustomersTable({ initialCustomers }: { initialCustomers: AdminCustomer[] }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const sources = Array.from(new Set(initialCustomers.map(customer => customer.source)));
  const filtered = useMemo(() => initialCustomers.filter(customer => {
    const matchesQuery = `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (source === "all" || customer.source === source);
  }), [initialCustomers, query, source]);
  function exportCsv() {
    const rows = [["Tên", "Email", "Điện thoại", "Nguồn", "Sản phẩm", "Tổng chi tiêu"], ...filtered.map(customer => [customer.name, customer.email, customer.phone, customer.source, String(customer.products), String(customer.spent)])];
    const blob = new Blob(["\uFEFF" + rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = href; anchor.download = "khach-hang.csv"; anchor.click(); URL.revokeObjectURL(href);
  }
  return <><div className="table-toolbar"><label><Search /><input aria-label="Tìm khách hàng" placeholder="Tìm theo tên, email, điện thoại..." value={query} onChange={event => setQuery(event.target.value)} /></label><select aria-label="Lọc theo nguồn" value={source} onChange={event => setSource(event.target.value)}><option value="all">Tất cả nguồn</option>{sources.map(item => <option key={item}>{item}</option>)}</select><button onClick={exportCsv}><Download /> Xuất CSV</button></div><section className="admin-card"><div className="admin-table-wrap"><table className="admin-table customers-table"><thead><tr><th>Khách hàng</th><th>Điện thoại</th><th>Ngày đăng ký</th><th>Nguồn</th><th>Sản phẩm</th><th>Tổng chi tiêu</th><th>Hoạt động cuối</th><th /></tr></thead><tbody>{filtered.map(customer => <tr key={customer.id}><td><Link className="customer-cell" href={`/admin/customers/${customer.id}`}><span>{customer.name.split(" ").map(word => word[0]).slice(-2).join("")}</span><div><b>{customer.name}</b><small>{customer.email}</small></div></Link></td><td>{customer.phone}</td><td>{customer.joined}</td><td><span className="source-chip">{customer.source}</span></td><td>{customer.products}</td><td><b>{formatVnd(customer.spent)}</b></td><td>{customer.lastActive}</td><td><Link className="text-link" href={`/admin/customers/${customer.id}`}>Chi tiết</Link></td></tr>)}{filtered.length === 0 && <tr><td colSpan={8}>Không tìm thấy khách hàng phù hợp.</td></tr>}</tbody></table></div><div className="table-footer"><span>Hiển thị {filtered.length} / {initialCustomers.length} khách hàng</span></div></section></>;
}
