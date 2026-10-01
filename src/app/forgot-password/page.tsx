"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Brand } from "@/components/brand";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const email = String(new FormData(event.currentTarget).get("email")); if (!isSupabaseConfigured) return setMessage("Supabase chưa được cấu hình."); const { error } = await createClient()!.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/reset-password` }); if (error) return setMessage(error.message); setSent(true); }
  return <main className="simple-auth"><Brand /><section><Mail /><span>KHÔI PHỤC TÀI KHOẢN</span><h1>Đặt lại mật khẩu.</h1><p>Nhập email đã đăng ký, chúng tôi sẽ gửi đường dẫn khôi phục.</p>{sent ? <div className="activation-result success"><div><b>Đã gửi email</b><span>Kiểm tra hộp thư và làm theo hướng dẫn.</span></div></div> : <form onSubmit={submit}><label>Email<input name="email" type="email" placeholder="ban@email.com" required /></label>{message && <p className="form-message" role="status">{message}</p>}<button className="button button-primary" type="submit">Gửi đường dẫn</button></form>}<Link href="/login"><ArrowLeft /> Quay lại đăng nhập</Link></section></main>;
}
