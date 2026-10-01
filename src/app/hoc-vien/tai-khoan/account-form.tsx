"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function AccountForm({ email, initialName, initialPhone }: { email: string; initialName: string; initialPhone: string }) {
  const [message, setMessage] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supabase = createClient();
    const { data: { user } } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    if (!supabase || !user) return setMessage("Phiên đăng nhập đã hết hạn.");
    const { error } = await supabase.from("profiles").update({ full_name: String(form.get("full_name")), phone: String(form.get("phone")), updated_at: new Date().toISOString() }).eq("id", user.id);
    setMessage(error ? error.message : "Đã lưu thông tin tài khoản.");
  }
  return <form className="admin-card settings-form" onSubmit={save}><label>Email<input value={email} disabled /></label><label>Họ và tên<input name="full_name" defaultValue={initialName} required /></label><label>Số điện thoại<input name="phone" defaultValue={initialPhone} /></label>{message && <p className="form-message" role="status">{message}</p>}<button className="button button-primary" type="submit">Lưu thay đổi</button></form>;
}
