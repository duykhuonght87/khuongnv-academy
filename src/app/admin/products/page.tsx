"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, StatusPill } from "@/components/admin-ui";
import { formatVnd, products as initialProducts } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/client";

export default function ProductsPage() {
  const [items, setItems] = useState(initialProducts);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("Sản phẩm mới");
  const [price, setPrice] = useState(799000);
  const [type, setType] = useState("Khóa học");
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.from("products").select("id,name,price_amount,product_type,status").order("created_at").then(({ data }) => {
      if (!data?.length) return;
      const typeLabels: Record<string, string> = { free: "FREE", course: "Khóa học", program: "Chương trình", service: "Dịch vụ" };
      setItems(data.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price_amount),
        type: typeLabels[product.product_type] ?? product.product_type,
        status: product.status === "hidden" ? "Ẩn" : "Đang bán",
        buyers: 0,
      })));
    });
  }, []);
  async function toggle(id: string) {
    const item = items.find(product => product.id === id);
    if (!item) return;
    const nextStatus = item.status === "Ẩn" ? "Đang bán" : "Ẩn";
    setItems(current => current.map(product => product.id === id ? { ...product, status: nextStatus } : product));
    const supabase = createClient();
    if (supabase && !id.startsWith("prd-")) await supabase.from("products").update({ status: nextStatus === "Ẩn" ? "hidden" : "active" }).eq("id", id);
  }
  async function remove(id: string) {
    setItems(current => current.filter(item => item.id !== id));
    const supabase = createClient();
    if (supabase && !id.startsWith("prd-")) await supabase.from("products").delete().eq("id", id);
  }
  async function createProduct() {
    const optimisticId = `prd-${Date.now()}`;
    const next = { id: optimisticId, name, price, type, status: "Đang bán", buyers: 0 };
    setItems(current => [...current, next]);
    setCreating(false);
    const supabase = createClient();
    if (!supabase) return;
    const slug = `${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;
    const typeMap: Record<string, string> = { "Khóa học": "course", "Chương trình": "program", "Dịch vụ": "service" };
    const { data } = await supabase.from("products").insert({ slug, name, price_amount: price, product_type: typeMap[type] ?? "course", status: "active" }).select("id").single();
    if (data?.id) setItems(current => current.map(item => item.id === optimisticId ? { ...item, id: data.id } : item));
  }
  return <AdminShell active="/admin/products">
    <AdminHeader eyebrow="CATALOG / SẢN PHẨM" title="Sản phẩm" description="Quản lý giá bán, trạng thái và quyền truy cập đi kèm." action={<button className="button button-primary" onClick={() => setCreating(true)}><Plus /> Tạo sản phẩm</button>} />
    {creating && <div className="inline-create"><div><span>TẠO SẢN PHẨM</span><button onClick={() => setCreating(false)} aria-label="Đóng"><X /></button></div><input aria-label="Tên sản phẩm" placeholder="Tên sản phẩm" value={name} onChange={event => setName(event.target.value)} /><input aria-label="Giá bán" placeholder="Giá bán" type="number" value={price} onChange={event => setPrice(Number(event.target.value))} /><select aria-label="Loại sản phẩm" value={type} onChange={event => setType(event.target.value)}><option>Khóa học</option><option>Chương trình</option><option>Dịch vụ</option></select><button className="button button-primary" onClick={createProduct}>Lưu sản phẩm</button></div>}
    <section className="product-admin-grid">{items.map(product => <article className="admin-card product-admin-card" key={product.id}><div className="product-admin-art"><span>{product.type}</span><b>{product.name.split(" ").slice(0, 2).join(" ")}</b></div><div className="product-admin-body"><div><StatusPill status={product.status} /><span>{product.buyers} khách</span></div><h2>{product.name}</h2><strong>{product.price ? formatVnd(product.price) : "Miễn phí"}</strong><div className="card-actions"><button><Pencil /> Sửa</button><button onClick={() => toggle(product.id)}>{product.status === "Ẩn" ? <Eye /> : <EyeOff />} {product.status === "Ẩn" ? "Hiện" : "Ẩn"}</button><button className="danger" onClick={() => remove(product.id)}><Trash2 /> Xóa</button></div></div></article>)}</section>
  </AdminShell>;
}
