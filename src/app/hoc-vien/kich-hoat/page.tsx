"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ActivatePage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  async function activate() {
    if (!isSupabaseConfigured) return setStatus(code.trim().toUpperCase() === "OPC-X8F21" ? "success" : "error");
    const { error } = await createClient()!.rpc("redeem_activation_code", { input_code: code });
    setStatus(error ? "error" : "success");
  }
  return <StudentShell active="/hoc-vien/kich-hoat"><section className="activation-page"><span className="activation-icon"><KeyRound /></span><p>KÍCH HOẠT SẢN PHẨM</p><h1>Nhập mã để mở khóa lộ trình.</h1><span>Mã kích hoạt được gửi sau khi hoàn tất thanh toán hoặc do quản trị viên cấp.</span><div className="activation-form"><input value={code} onChange={event => setCode(event.target.value)} placeholder="Ví dụ: OPC-X8F21" /><button className="button button-primary" onClick={activate}>Kích hoạt</button></div>{status === "success" && <div className="activation-result success"><CheckCircle2 /><div><b>Kích hoạt thành công</b><span>OPC 4 tuần đã được thêm vào tài khoản của bạn.</span></div></div>}{status === "error" && <div className="activation-result error"><div><b>Mã không hợp lệ hoặc đã được sử dụng.</b><span>Kiểm tra lại ký tự hoặc liên hệ hỗ trợ.</span></div></div>}<small>Mã demo: OPC-X8F21</small></section></StudentShell>;
}
