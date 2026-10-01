"use client";

import { useEffect, useState } from "react";
import { Copy, KeyRound, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, StatusPill } from "@/components/admin-ui";
import { activationCodes as seedCodes } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/client";

export default function ActivationCodesPage() {
  const [codes, setCodes] = useState(seedCodes);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.from("activation_codes").select("code,status,used_at,products(name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (!data?.length) return;
      setCodes(data.map(item => {
        const relation = item.products as unknown as { name: string } | { name: string }[] | null;
        const product = Array.isArray(relation) ? relation[0] : relation;
        return {
          code: item.code,
          product: product?.name ?? "Sản phẩm",
          status: item.status === "used" ? "Đã dùng" : item.status === "disabled" ? "Đã khóa" : "Chưa dùng",
          usedBy: item.status === "used" ? "Học viên" : "—",
          usedAt: item.used_at ? new Intl.DateTimeFormat("vi-VN").format(new Date(item.used_at)) : "—",
        };
      }));
    });
  }, []);
  async function generate() {
    const code = `OPC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase chưa được cấu hình.");
      return;
    }
    setMessage("Đang tạo mã...");
    const { data: product, error: productError } = await supabase.from("products").select("id,name").eq("slug", "opc-4-tuan").single();
    if (productError || !product) {
      setMessage("Không tìm thấy sản phẩm OPC 4 tuần.");
      return;
    }
    const { error } = await supabase.from("activation_codes").insert({ code, product_id: product.id, status: "active" });
    if (error) {
      setMessage(`Không thể tạo mã: ${error.message}`);
      return;
    }
    setCodes(current => [{ code, product: product.name, status: "Chưa dùng", usedBy: "—", usedAt: "—" }, ...current]);
    setMessage(`Đã tạo mã ${code}.`);
  }
  const unusedCount = codes.filter(item => item.status === "Chưa dùng").length;
  const usedCount = codes.filter(item => item.status === "Đã dùng").length;
  const productCount = new Set(codes.map(item => item.product)).size;
  return <AdminShell active="/admin/activation-codes">
    <AdminHeader eyebrow="ACCESS / MÃ KÍCH HOẠT" title="Mã kích hoạt" description="Tạo và theo dõi mã cấp quyền sản phẩm cho học viên." action={<button className="button button-primary" onClick={generate}><Plus /> Tạo mã mới</button>} />
    {message && <p role="status" className="form-message">{message}</p>}
    <section className="metrics-grid compact-metrics"><article className="metric-card lime"><span>MÃ CHƯA DÙNG</span><strong>{unusedCount}</strong></article><article className="metric-card mint"><span>ĐÃ KÍCH HOẠT</span><strong>{usedCount}</strong></article><article className="metric-card blue"><span>SẢN PHẨM</span><strong>{productCount}</strong></article></section>
    <section className="admin-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã</th><th>Sản phẩm</th><th>Trạng thái</th><th>Người sử dụng</th><th>Ngày dùng</th><th /></tr></thead><tbody>{codes.map(item => <tr key={item.code}><td><span className="code-cell"><KeyRound /> <b>{item.code}</b></span></td><td>{item.product}</td><td><StatusPill status={item.status} /></td><td>{item.usedBy}</td><td>{item.usedAt}</td><td><button className="row-menu" aria-label={`Sao chép ${item.code}`} onClick={() => navigator.clipboard.writeText(item.code)}><Copy /></button></td></tr>)}</tbody></table></div></section>
  </AdminShell>;
}
