import type { Metadata } from "next";
import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = { title: "Tạo tài khoản" };

export default function RegisterPage() { return <LoginForm initialMode="signup" />; }
