import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="KhươngNV Academy - Trang chủ">
      <span className="brand-mark" aria-hidden="true">K</span>
      {!compact && <span>KHƯƠNGNV <em>ACADEMY</em></span>}
    </Link>
  );
}
