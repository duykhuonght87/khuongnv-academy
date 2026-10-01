import Link from "next/link";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return <main className="not-found"><Brand /><span>404</span><h1>Nội dung này chưa có trong lộ trình.</h1><Link className="button button-primary" href="/dashboard">Về tổng quan</Link></main>;
}
