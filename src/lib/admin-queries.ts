import { orders as demoOrders, type OrderStatus } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/server";

export type AdminOrder = (typeof demoOrders)[number] & { createdAtIso?: string };

const statusLabel: Record<string, OrderStatus> = {
  paid: "Đã thanh toán",
  pending: "Chờ thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
  cancelled: "Thất bại",
};

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const supabase = await createClient();
  if (!supabase) return demoOrders;

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, user_id, customer_name, total_amount, status, created_at, order_items(product_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return [];
  if (!data?.length) return [];
  return data.map((order) => ({
    id: order.order_number,
    customerId: order.user_id ?? order.id,
    customer: order.customer_name,
    product: order.order_items?.[0]?.product_name ?? "Sản phẩm",
    amount: Number(order.total_amount),
    status: statusLabel[order.status] ?? "Chờ thanh toán",
    createdAtIso: order.created_at,
    createdAt: new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(order.created_at)).replace(",", " ·"),
  }));
}

export async function getAdminCounts() {
  const supabase = await createClient();
  if (!supabase) return { customers: 0, students: 0 };
  const [customers, students] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).neq("role", "admin"),
    supabase.from("enrollments").select("user_id", { count: "exact", head: true }),
  ]);
  return { customers: customers.count ?? 0, students: students.count ?? 0 };
}

export function getRevenueMetrics(orders: AdminOrder[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfSevenDays = startOfToday - 6 * 24 * 60 * 60 * 1000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const paid = orders.filter(order => order.status === "Đã thanh toán");
  const sumSince = (timestamp: number) => paid.reduce((sum, order) => {
    const created = order.createdAtIso ? new Date(order.createdAtIso).getTime() : 0;
    return created >= timestamp ? sum + order.amount : sum;
  }, 0);
  const paidTotal = paid.reduce((sum, order) => sum + order.amount, 0);
  const refunded = orders.filter(order => order.status === "Đã hoàn tiền").reduce((sum, order) => sum + order.amount, 0);
  return {
    today: sumSince(startOfToday),
    sevenDays: sumSince(startOfSevenDays),
    month: sumSince(startOfMonth),
    paidTotal,
    refunded,
    aov: paid.length ? Math.round(paidTotal / paid.length) : 0,
  };
}

export function getDailyRevenueSeries(orders: AdminOrder[]) {
  const formatter = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit" });
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const label = formatter.format(day);
    const amount = orders.reduce((sum, order) => {
      if (order.status !== "Đã thanh toán" || !order.createdAtIso) return sum;
      return formatter.format(new Date(order.createdAtIso)) === label ? sum + order.amount : sum;
    }, 0);
    return { label, amount };
  });
}
