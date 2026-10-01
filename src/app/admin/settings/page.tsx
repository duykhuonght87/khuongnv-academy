"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader } from "@/components/admin-ui";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [academyName, setAcademyName] = useState("KhươngNV Academy");
  const [tagline, setTagline] = useState("Làm chủ ChatGPT — Đóng gói chuyên môn — Xây dựng Doanh nghiệp Một Người");
  const [supportEmail, setSupportEmail] = useState("support@khuongnv.academy");
  const [communityUrl, setCommunityUrl] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.from("site_settings").select("academy_name,tagline,support_email,community_url").eq("id", "default").maybeSingle().then(({ data }) => {
      if (!data) return;
      setAcademyName(data.academy_name); setTagline(data.tagline); setSupportEmail(data.support_email); setCommunityUrl(data.community_url ?? "");
    });
  }, []);

  async function save() {
    setSaving(true); setMessage("");
    const supabase = createClient();
    if (!supabase) { setMessage("Chưa kết nối Supabase."); setSaving(false); return; }
    const { error } = await supabase.from("site_settings").upsert({ id: "default", academy_name: academyName.trim(), tagline: tagline.trim(), support_email: supportEmail.trim(), community_url: communityUrl.trim() || null, updated_at: new Date().toISOString() });
    setMessage(error ? `Không thể lưu: ${error.message}` : "Đã lưu cài đặt hệ thống."); setSaving(false);
  }

  return <AdminShell active="/admin/settings"><AdminHeader eyebrow="HỆ THỐNG / CÀI ĐẶT" title="Cài đặt" description="Thông tin thương hiệu và cấu hình mặc định." /><section className="admin-card settings-form"><label>Tên hệ thống<input value={academyName} onChange={event => setAcademyName(event.target.value)} /></label><label>Tagline<input value={tagline} onChange={event => setTagline(event.target.value)} /></label><label>Email hỗ trợ<input type="email" value={supportEmail} onChange={event => setSupportEmail(event.target.value)} /></label><label>Liên kết cộng đồng<input type="url" placeholder="https://..." value={communityUrl} onChange={event => setCommunityUrl(event.target.value)} /></label>{message && <p className="admin-form-message" role="status">{message}</p>}<button className="button button-primary" disabled={saving} onClick={save}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</button></section></AdminShell>;
}
