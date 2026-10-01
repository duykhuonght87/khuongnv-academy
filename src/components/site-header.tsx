import Link from "next/link";
import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Điều hướng chính">
        <Link href="/#chuong-trinh">Chương trình</Link>
        <Link href="/#phuong-phap">Phương pháp</Link>
        <Link className="button button-ghost button-small" href="/login">Đăng nhập</Link>
      </nav>
    </header>
  );
}
