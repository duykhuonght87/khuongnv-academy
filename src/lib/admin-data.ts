export type OrderStatus = "Đã thanh toán" | "Chờ thanh toán" | "Thất bại" | "Đã hoàn tiền";

export const revenueSeries = [
  { day: "25/09", amount: 980000 },
  { day: "26/09", amount: 1598000 },
  { day: "27/09", amount: 799000 },
  { day: "28/09", amount: 2397000 },
  { day: "29/09", amount: 3196000 },
  { day: "30/09", amount: 3995000 },
  { day: "01/10", amount: 3815000 },
];

export const customers = [
  { id: "cus-001", name: "Nguyễn Văn Khương", email: "khuong.nguyen@example.com", phone: "0903 118 286", joined: "01/10/2026", source: "YouTube", products: 2, spent: 856000, progress: 43, lastActive: "01/10/2026" },
  { id: "cus-002", name: "Trần Minh Anh", email: "minhanh@example.com", phone: "0982 441 902", joined: "30/09/2026", source: "Facebook", products: 1, spent: 799000, progress: 68, lastActive: "01/10/2026" },
  { id: "cus-003", name: "Lê Hoàng Nam", email: "hoangnam@example.com", phone: "0917 662 104", joined: "29/09/2026", source: "TikTok", products: 3, spent: 1647000, progress: 24, lastActive: "30/09/2026" },
  { id: "cus-004", name: "Phạm Thanh Hà", email: "thanhha@example.com", phone: "0934 520 883", joined: "28/09/2026", source: "Giới thiệu", products: 1, spent: 49000, progress: 100, lastActive: "29/09/2026" },
  { id: "cus-005", name: "Vũ Đức Long", email: "duclong@example.com", phone: "0968 222 517", joined: "27/09/2026", source: "Landing page", products: 2, spent: 1598000, progress: 51, lastActive: "01/10/2026" },
];

export const orders: Array<{ id: string; customerId: string; customer: string; product: string; amount: number; status: OrderStatus; createdAt: string }> = [
  { id: "KNA-1021", customerId: "cus-001", customer: "Nguyễn Văn Khương", product: "Đóng gói chuyên môn", amount: 799000, status: "Đã thanh toán", createdAt: "01/10/2026 · 09:42" },
  { id: "KNA-1020", customerId: "cus-002", customer: "Trần Minh Anh", product: "Đóng gói chuyên môn", amount: 799000, status: "Đã thanh toán", createdAt: "01/10/2026 · 08:18" },
  { id: "KNA-1019", customerId: "cus-003", customer: "Lê Hoàng Nam", product: "OPC 4 tuần", amount: 1299000, status: "Chờ thanh toán", createdAt: "30/09/2026 · 22:06" },
  { id: "KNA-1018", customerId: "cus-004", customer: "Phạm Thanh Hà", product: "Landing Page bằng ChatGPT", amount: 49000, status: "Đã thanh toán", createdAt: "30/09/2026 · 17:31" },
  { id: "KNA-1017", customerId: "cus-005", customer: "Vũ Đức Long", product: "Đóng gói chuyên môn", amount: 799000, status: "Đã hoàn tiền", createdAt: "30/09/2026 · 14:12" },
  { id: "KNA-1016", customerId: "cus-003", customer: "Lê Hoàng Nam", product: "Landing Page bằng ChatGPT", amount: 49000, status: "Thất bại", createdAt: "29/09/2026 · 21:50" },
];

export const products = [
  { id: "prd-free", name: "Bản đồ Doanh nghiệp Một Người", price: 0, type: "FREE", status: "Đang bán", buyers: 136 },
  { id: "prd-landing", name: "Landing Page bằng ChatGPT", price: 49000, type: "Khóa học", status: "Đang bán", buyers: 62 },
  { id: "prd-pack", name: "Đóng gói chuyên môn bằng ChatGPT", price: 799000, type: "Khóa học", status: "Đang bán", buyers: 31 },
  { id: "prd-opc", name: "OPC 4 tuần", price: 1299000, type: "Chương trình", status: "Đang bán", buyers: 18 },
  { id: "prd-mentor", name: "Mentoring 1:1", price: 4999000, type: "Dịch vụ", status: "Ẩn", buyers: 5 },
];

export const activationCodes = [
  { code: "OPC-X8F21", product: "OPC 4 tuần", status: "Chưa dùng", usedBy: "—", usedAt: "—" },
  { code: "PACK-N7K44", product: "Đóng gói chuyên môn", status: "Đã dùng", usedBy: "minhanh@example.com", usedAt: "30/09/2026" },
  { code: "LP-C2M90", product: "Landing Page bằng ChatGPT", status: "Chưa dùng", usedBy: "—", usedAt: "—" },
];

export const roadmap = [
  { level: 1, slug: "lam-chu-chatgpt", title: "Làm chủ ChatGPT", description: "Tư duy nền tảng và kỹ thuật làm việc với AI.", lessons: 8, progress: 100, status: "Hoàn thành" },
  { level: 2, slug: "dong-goi-chuyen-mon", title: "Đóng gói chuyên môn", description: "Biến kinh nghiệm thành hệ thống có thể bán.", lessons: 10, progress: 50, status: "Đang học" },
  { level: 3, slug: "tao-san-pham-so", title: "Tạo sản phẩm số", description: "Từ ý tưởng đến sản phẩm phiên bản đầu tiên.", lessons: 7, progress: 0, status: "Đang học" },
  { level: 4, slug: "content-machine", title: "Content Machine", description: "Xây cỗ máy nội dung nhất quán bằng AI.", lessons: 9, progress: 0, status: "Chưa mở khóa" },
  { level: 5, slug: "landing-page-funnel", title: "Landing Page & Funnel", description: "Thiết kế hành trình chuyển đổi tinh gọn.", lessons: 8, progress: 0, status: "Chưa mở khóa" },
  { level: 6, slug: "automation", title: "Automation", description: "Tự động hóa vận hành doanh nghiệp một người.", lessons: 6, progress: 0, status: "Chưa mở khóa" },
];

export function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}
