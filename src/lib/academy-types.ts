export type StudentCourseSummary = {
  id: string;
  slug: string;
  code: string;
  title: string;
  description: string;
  level: string;
  position: number;
  lessonCount: number;
  completedCount: number;
  progress: number;
  unlocked: boolean;
};

export type StudentProduct = {
  id: string;
  name: string;
  grantedAt: string;
  expiresAt: string | null;
};

export type StudentDashboardData = {
  fullName: string;
  courses: StudentCourseSummary[];
  products: StudentProduct[];
  overallProgress: number;
  completedLevels: number;
  lastLesson: { courseSlug: string; courseTitle: string; lessonTitle: string } | null;
};

export type AcademyLesson = {
  id: string;
  slug: string;
  title: string;
  content: string;
  videoUrl: string | null;
  downloadUrl: string | null;
  durationMinutes: number;
  position: number;
  moduleId: string | null;
  moduleTitle: string;
};

export type StudentCourseDetail = StudentCourseSummary & {
  lessons: AcademyLesson[];
  completedLessonSlugs: string[];
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  source: string;
  products: number;
  spent: number;
  progress: number;
  lastActive: string;
};

export type AdminCustomerDetail = AdminCustomer & {
  accesses: Array<{ id: string; name: string; grantedAt: string }>;
  orders: Array<{ id: string; product: string; amount: number; status: string; createdAt: string }>;
};
