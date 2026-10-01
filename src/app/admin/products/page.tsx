"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, StatusPill } from "@/components/admin-ui";
import { formatVnd, products as initialProducts } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/client";

type ProductRow = (typeof initialProducts)[number];
const typeLabels: Record<string, string> = { free: "FREE", course: "Khóa học", program: "Chương trình", service: "Dịch vụ" };
const typeValues: Record<string, string> = { FREE: "free", "Khóa học": "course", "Chương trình": "program", "Dịch vụ": "service" };

export default function ProductsPage() {
  const [items, setItems] = useState<ProductRow[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("Khóa học");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    const supabase = createClient();
    if (!supabase) return;
    const { data, error } = await supabase.from("products").select("id,name,price_amount,product_type,status").order("created_at");
    if (error) { setMessage(`Không thể tải sản phẩm: ${error.message}`); return; }
    setItems((data ?? []).map(product => ({ id: product.id, name: product.name, price: Number(product.price_amount), type: typeLabels[product.product_type] ?? product.product_type, status: product.status === "hidden" ? "Ẩn" : "Đang bán", buyers: 0 })));
  }
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.from("products").select("id,name,price_amount,product_type,status").order("created_at").then(({ data, error }) => {
      if (error) { setMessage(`Không thể tải sản phẩm: ${error.message}`); return; }
      setItems((data ?? []).map(product => ({ id: product.id, name: product.name, price: Number(product.price_amount), type: typeLabels[product.product_type] ?? product.product_type, status: product.status === "hidden" ? "Ẩn" : "Đang bán", buyers: 0 })));
    });
  }, []);
  function openCreate() { setEditingId("new"); setName(""); setPrice(0); setType("Khóa học"); setMessage(""); }
  function openEdit(product: ProductRow) { setEditingId(product.id); setName(product.name); setPrice(product.price); setType(product.type); setMessage(""); }

  async function saveProduct() {
    if (!name.trim() || price < 0) { setMessage("Vui lòng nhập tên và giá hợp lệ."); return; }
    const supabase = createClient();
    if (!supabase) { setMessage("Chưa kết nối Supabase."); return; }
    const payload = { name: name.trim(), price_amount: price, product_type: typeValues[type] ?? "course", updated_at: new Date().toISOString() };
    const result = editingId === "new"
      ? await supabase.from("products").insert({ ...payload, slug: `${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`, status: "active" })
      : await supabase.from("products").update(payload).eq("id", editingId);
    if (result.error) { setMessage(`Không thể lưu: ${result.error.message}`); return; }
    setEditingId(null); setMessage("Đã lưu sản phẩm."); await loadProducts();
  }
  async function toggle(product: ProductRow) {
    const supabase = createClient();
    if (!supabase) { setMessage("Chưa kết nối Supabase."); return; }
    const { error } = await supabase.from("products").update({ status: product.status === "Ẩn" ? "active" : "hidden", updated_at: new Date().toISOString() }).eq("id", product.id);
    if (error) { setMessage(`Không thể đổi trạng thái: ${error.message}`); return; }
    await loadProducts();
  }
  async function remove(product: ProductRow) {
    if (!window.confirm(`Xóa sản phẩm “${product.name}”? Hành động này không thể hoàn tác.`)) return;
    const supabase = createClient();
    if (!supabase) { setMessage("Chưa kết nối Supabase."); return; }
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) { setMessage(`Không thể xóa: ${error.message}`); return; }
    setMessage("Đã xóa sản phẩm."); await loadProducts();
  }

  return <AdminShell active="/admin/products">
    <AdminHeader eyebrow="CATALOG / SẢN PHẨM" title="Sản phẩm" description="Quản lý giá bán, trạng thái và quyền truy cập đi kèm." action={<button className="button button-primary" onClick={openCreate}><Plus /> Tạo sản phẩm</button>} />
    {editingId && <div className="inline-create"><div><span>{editingId === "new" ? "TẠO SẢN PHẨM" : "CHỈNH SỬA SẢN PHẨM"}</span><button onClick={() => setEditingId(null)} aria-label="Đóng"><X /></button></div><input aria-label="Tên sản phẩm" placeholder="Tên sản phẩm" value={name} onChange={event => setName(event.target.value)} /><input aria-label="Giá bán" placeholder="Giá bán" type="number" min="0" value={price} onChange={event => setPrice(Number(event.target.value))} /><select aria-label="Loại sản phẩm" value={type} onChange={event => setType(event.target.value)}><option>FREE</option><option>Khóa học</option><option>Chương trình</option><option>Dịch vụ</option></select><button className="button button-primary" onClick={saveProduct}>Lưu sản phẩm</button></div>}
    {message && <p className="admin-form-message" role="status">{message}</p>}
    <section className="product-admin-grid">{items.map(product => <article className="admin-card product-admin-card" key={product.id}><div className="product-admin-art"><span>{product.type}</span><b>{product.name.split(" ").slice(0, 2).join(" ")}</b></div><div className="product-admin-body"><div><StatusPill status={product.status} /><span>{product.buyers} khách</span></div><h2>{product.name}</h2><strong>{product.price ? formatVnd(product.price) : "Miễn phí"}</strong><div className="card-actions"><button onClick={() => openEdit(product)}><Pencil /> Sửa</button><button onClick={() => toggle(product)}>{product.status === "Ẩn" ? <Eye /> : <EyeOff />} {product.status === "Ẩn" ? "Hiện" : "Ẩn"}</button><button className="danger" onClick={() => remove(product)}><Trash2 /> Xóa</button></div></div></article>)}</section>
  </AdminShell>;
}
