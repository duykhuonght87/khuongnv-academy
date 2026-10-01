"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Brand } from "@/components/brand";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm({ initialMode = "login" }: { initialMode?: "login" | "signup" }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    if (!isSupabaseConfigured) {
      router.push("/hoc-vien");
      return;
    }

    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const result = mode === "login"
      ? await supabase!.auth.signInWithPassword({ email, password })
      : await supabase!.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });

    setLoading(false);
    if (result.error) return setMessage(result.error.message);
    if (mode === "signup") return setMessage("Kiểm tra email để xác nhận tài khoản của bạn.");
    const userId = result.data.user?.id;
    if (!userId) return setMessage("Không thể xác định tài khoản. Vui lòng thử lại.");
    const { data: profile } = await supabase!.from("profiles").select("role").eq("id", userId).single();
    router.push(profile?.role === "admin" ? "/admin" : "/hoc-vien");
    router.refresh();
  }

  async function handleGoogleLogin() {
    if (!isSupabaseConfigured) return router.push("/hoc-vien");
    const supabase = createClient();
    await supabase!.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
  }

  return (
    <main className="auth-page">
      <div className="auth-visual">
        <Link className="auth-brand" href="/"><Brand /></Link>
        <div className="auth-quote">
          <span>BUILD YOUR SYSTEM</span>
          <h1>Tiến bộ không đến từ cảm hứng.<br /><em>Nó đến từ hệ thống.</em></h1>
          <p>Khương Nguyễn · Founder, KhươngNV Academy</p>
        </div>
        <div className="auth-grid" aria-hidden="true" />
        <div className="auth-orbit" aria-hidden="true"><i /><i /><i /></div>
      </div>
      <section className="auth-panel">
        <div className="auth-mobile-brand"><Brand /></div>
        <div className="auth-card">
          <div className="auth-heading">
            <span>{mode === "login" ? "CHÀO MỪNG TRỞ LẠI" : "BẮT ĐẦU LỘ TRÌNH"}</span>
            <h2>{mode === "login" ? "Tiếp tục hành trình của bạn." : "Tạo tài khoản học viên."}</h2>
            <p>{mode === "login" ? "Đăng nhập để tiếp tục bài học đang dở." : "Một tài khoản để lưu khóa học và tiến độ."}</p>
          </div>
          <div className="auth-tabs" role="tablist">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">Đăng nhập</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">Tạo tài khoản</button>
          </div>
          <button className="google-button" type="button" onClick={handleGoogleLogin}><span>G</span> Tiếp tục với Google</button>
          <div className="auth-divider"><span>hoặc dùng email</span></div>
          <form onSubmit={handleSubmit}>
            <label>Email<input name="email" type="email" autoComplete="email" placeholder="ban@email.com" required /></label>
            <label>Mật khẩu<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Tối thiểu 6 ký tự" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
            {message && <p className="form-message" role="status">{message}</p>}
            {mode === "login" && <Link className="forgot-link" href="/forgot-password">Quên mật khẩu?</Link>}
            <button className="button button-primary button-wide" disabled={loading} type="submit">{loading ? <LoaderCircle className="spin" /> : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}<ArrowUpRight /></button>
          </form>
          {!isSupabaseConfigured && <div className="demo-note"><b>Chế độ demo</b><span>Supabase chưa được kết nối. Dùng email/mật khẩu bất kỳ để vào trải nghiệm.</span></div>}
          <Link className="back-link" href="/">Quay lại trang chủ</Link>
        </div>
      </section>
    </main>
  );
}
