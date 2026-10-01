"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CheckCircle2, KeyRound, LoaderCircle } from "lucide-react";
import { Brand } from "@/components/brand";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirmation = String(form.get("confirmation"));

    if (password !== confirmation) {
      setMessage("Hai mật khẩu chưa trùng khớp.");
      return;
    }
    if (!isSupabaseConfigured) {
      setMessage("Supabase chưa được cấu hình.");
      return;
    }

    setLoading(true);
    setMessage("");
    const { error } = await createClient()!.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage(error.message === "Auth session missing!"
        ? "Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu một liên kết mới."
        : error.message);
      return;
    }
    setSuccess(true);
  }

  return (
    <main className="simple-auth">
      <Brand />
      <section>
        {success ? <CheckCircle2 /> : <KeyRound />}
        <span>{success ? "CẬP NHẬT THÀNH CÔNG" : "BẢO MẬT TÀI KHOẢN"}</span>
        <h1>{success ? "Mật khẩu đã được đổi." : "Tạo mật khẩu mới."}</h1>
        {success ? (
          <>
            <p>Bạn có thể tiếp tục vào khu vực học viên bằng mật khẩu mới.</p>
            <Link className="button button-primary" href="/hoc-vien">Vào khu vực học viên</Link>
          </>
        ) : (
          <>
            <p>Mật khẩu mới cần có ít nhất 6 ký tự.</p>
            <form onSubmit={submit}>
              <label>Mật khẩu mới<input name="password" type="password" minLength={6} autoComplete="new-password" required /></label>
              <label>Nhập lại mật khẩu<input name="confirmation" type="password" minLength={6} autoComplete="new-password" required /></label>
              {message && <p className="form-message" role="status">{message}</p>}
              <button className="button button-primary" disabled={loading} type="submit">
                {loading ? <LoaderCircle className="spin" /> : "Lưu mật khẩu mới"}
              </button>
            </form>
            <Link href="/forgot-password">Yêu cầu liên kết mới</Link>
          </>
        )}
      </section>
    </main>
  );
}
