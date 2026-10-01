import { createClient } from "@/lib/supabase/server";
import type { AdminCustomer, AdminCustomerDetail, StudentCourseDetail, StudentCourseSummary, StudentDashboardData, StudentProduct } from "@/lib/academy-types";

const dateVi = (value?: string | null) => value ? new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value)) : "—";

export async function getStudentDashboardData(): Promise<StudentDashboardData | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileResult, accessResult, courseResult, progressResult] = await Promise.all([
    supabase.from("profiles").select("full_name,role").eq("id", user.id).single(),
    supabase.from("user_product_access").select("product_id,granted_at,expires_at,products(id,name)").eq("user_id", user.id),
    supabase.from("courses").select("id,slug,code,title,description,level,position,lesson_count,product_id").like("code", "OPC-%").eq("status", "published").order("position"),
    supabase.from("lesson_progress").select("course_slug,lesson_slug,completed_at,updated_at").eq("user_id", user.id).not("completed_at", "is", null).order("updated_at", { ascending: false }),
  ]);

  const profile = profileResult.data;
  const accessRows = accessResult.data ?? [];
  const accessIds = new Set(accessRows.filter(row => !row.expires_at || new Date(row.expires_at) > new Date()).map(row => row.product_id));
  const progressRows = progressResult.data ?? [];
  const completedByCourse = new Map<string, number>();
  for (const row of progressRows) completedByCourse.set(row.course_slug, (completedByCourse.get(row.course_slug) ?? 0) + 1);

  const courses: StudentCourseSummary[] = (courseResult.data ?? []).map(course => {
    const completedCount = completedByCourse.get(course.slug) ?? 0;
    const lessonCount = Math.max(Number(course.lesson_count) || 0, completedCount);
    const unlocked = profile?.role === "admin" || !course.product_id || accessIds.has(course.product_id);
    return {
      id: course.id,
      slug: course.slug,
      code: course.code,
      title: course.title,
      description: course.description,
      level: course.level,
      position: Number(course.position) || 0,
      lessonCount,
      completedCount,
      progress: lessonCount ? Math.round((completedCount / lessonCount) * 100) : 0,
      unlocked,
    };
  });

  const products: StudentProduct[] = accessRows.map(row => {
    const relation = row.products as unknown as { id: string; name: string } | { id: string; name: string }[] | null;
    const product = Array.isArray(relation) ? relation[0] : relation;
    return { id: product?.id ?? row.product_id, name: product?.name ?? "Sản phẩm", grantedAt: row.granted_at, expiresAt: row.expires_at };
  });
  const totalLessons = courses.filter(course => course.unlocked).reduce((sum, course) => sum + course.lessonCount, 0);
  const completedLessons = courses.reduce((sum, course) => sum + course.completedCount, 0);
  const latest = progressRows[0];
  const latestCourse = latest ? courses.find(course => course.slug === latest.course_slug) : null;

  return {
    fullName: profile?.full_name || user.email?.split("@")[0] || "Học viên",
    courses,
    products,
    overallProgress: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
    completedLevels: courses.filter(course => course.progress === 100).length,
    lastLesson: latest && latestCourse ? { courseSlug: latestCourse.slug, courseTitle: latestCourse.title, lessonTitle: latest.lesson_slug.replaceAll("-", " ") } : null,
  };
}

export async function getStudentCourseDetail(slug: string): Promise<StudentCourseDetail | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: course }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase.from("courses").select("id,slug,code,title,description,level,position,lesson_count,product_id").eq("slug", slug).eq("status", "published").single(),
  ]);
  if (!course) return null;
  let unlocked = profile?.role === "admin" || !course.product_id;
  if (!unlocked) {
    const { data: access } = await supabase.from("user_product_access").select("id").eq("user_id", user.id).eq("product_id", course.product_id).or("expires_at.is.null,expires_at.gt." + new Date().toISOString()).maybeSingle();
    unlocked = Boolean(access);
  }
  if (!unlocked) return { id: course.id, slug: course.slug, code: course.code, title: course.title, description: course.description, level: course.level, position: course.position, lessonCount: course.lesson_count, completedCount: 0, progress: 0, unlocked: false, lessons: [], completedLessonSlugs: [] };

  const [lessonResult, moduleResult, progressResult] = await Promise.all([
    supabase.from("lessons").select("id,slug,title,content,video_url,download_url,duration_minutes,position,module_id").eq("course_id", course.id).eq("status", "published").order("position"),
    supabase.from("course_modules").select("id,title").eq("course_id", course.id).order("position"),
    supabase.from("lesson_progress").select("lesson_slug").eq("user_id", user.id).eq("course_slug", slug).not("completed_at", "is", null),
  ]);
  const moduleNames = new Map((moduleResult.data ?? []).map(module => [module.id, module.title]));
  const lessons = (lessonResult.data ?? []).map(lesson => ({
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.video_url,
    downloadUrl: lesson.download_url,
    durationMinutes: lesson.duration_minutes,
    position: lesson.position,
    moduleId: lesson.module_id,
    moduleTitle: lesson.module_id ? moduleNames.get(lesson.module_id) ?? "Nội dung khóa học" : "Nội dung khóa học",
  }));
  const completedLessonSlugs = (progressResult.data ?? []).map(row => row.lesson_slug);
  return {
    id: course.id,
    slug: course.slug,
    code: course.code,
    title: course.title,
    description: course.description,
    level: course.level,
    position: course.position,
    lessonCount: lessons.length,
    completedCount: completedLessonSlugs.length,
    progress: lessons.length ? Math.round((completedLessonSlugs.length / lessons.length) * 100) : 0,
    unlocked: true,
    lessons,
    completedLessonSlugs,
  };
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const [profilesResult, ordersResult, accessResult, progressResult] = await Promise.all([
    supabase.from("profiles").select("id,full_name,phone,source,created_at,last_active_at").neq("role", "admin").order("created_at", { ascending: false }),
    supabase.from("orders").select("user_id,customer_email,total_amount,status"),
    supabase.from("user_product_access").select("user_id"),
    supabase.from("lesson_progress").select("user_id,completed_at"),
  ]);
  const accessCounts = new Map<string, number>();
  for (const row of accessResult.data ?? []) accessCounts.set(row.user_id, (accessCounts.get(row.user_id) ?? 0) + 1);
  const completedCounts = new Map<string, number>();
  for (const row of progressResult.data ?? []) if (row.completed_at) completedCounts.set(row.user_id, (completedCounts.get(row.user_id) ?? 0) + 1);
  const paidByUser = new Map<string, number>();
  const emails = new Map<string, string>();
  for (const row of ordersResult.data ?? []) {
    if (row.user_id) emails.set(row.user_id, row.customer_email);
    if (row.user_id && row.status === "paid") paidByUser.set(row.user_id, (paidByUser.get(row.user_id) ?? 0) + Number(row.total_amount));
  }
  return (profilesResult.data ?? []).map(profile => ({
    id: profile.id,
    name: profile.full_name || "Học viên",
    email: emails.get(profile.id) ?? "Chưa có đơn hàng",
    phone: profile.phone || "—",
    joined: dateVi(profile.created_at),
    source: profile.source || "Trực tiếp",
    products: accessCounts.get(profile.id) ?? 0,
    spent: paidByUser.get(profile.id) ?? 0,
    progress: Math.min(100, (completedCounts.get(profile.id) ?? 0) * 10),
    lastActive: dateVi(profile.last_active_at || profile.created_at),
  }));
}

export async function getAdminCustomerDetail(id: string): Promise<AdminCustomerDetail | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const customer = (await getAdminCustomers()).find(item => item.id === id);
  if (!customer) return null;
  const [accessResult, orderResult] = await Promise.all([
    supabase.from("user_product_access").select("id,granted_at,products(name)").eq("user_id", id).order("granted_at", { ascending: false }),
    supabase.from("orders").select("order_number,total_amount,status,created_at,order_items(product_name)").eq("user_id", id).order("created_at", { ascending: false }),
  ]);
  const statuses: Record<string, string> = { paid: "Đã thanh toán", pending: "Chờ thanh toán", failed: "Thất bại", refunded: "Đã hoàn tiền", cancelled: "Đã hủy" };
  return {
    ...customer,
    accesses: (accessResult.data ?? []).map(row => {
      const relation = row.products as unknown as { name: string } | { name: string }[] | null;
      return { id: row.id, name: (Array.isArray(relation) ? relation[0]?.name : relation?.name) ?? "Sản phẩm", grantedAt: dateVi(row.granted_at) };
    }),
    orders: (orderResult.data ?? []).map(row => {
      const relation = row.order_items as unknown as { product_name: string } | { product_name: string }[] | null;
      return { id: row.order_number, product: (Array.isArray(relation) ? relation[0]?.product_name : relation?.product_name) ?? "Sản phẩm", amount: Number(row.total_amount), status: statuses[row.status] ?? row.status, createdAt: dateVi(row.created_at) };
    }),
  };
}
