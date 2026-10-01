import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "KhươngNV Academy", template: "%s · KhươngNV Academy" },
  description: "Học thực chiến. Xây hệ thống. Tạo kết quả có thể đo lường.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
