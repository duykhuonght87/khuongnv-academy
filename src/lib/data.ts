export type Lesson = {
  slug: string;
  title: string;
  duration: string;
  order: number;
  preview?: boolean;
  content: string[];
};

export type Course = {
  slug: string;
  code: string;
  title: string;
  description: string;
  level: string;
  accent: string;
  instructor: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    slug: "nen-mong-kinh-doanh-so",
    code: "KV-01",
    title: "Nền móng kinh doanh số",
    description: "Xây hệ tư duy, chọn thị trường và tạo đề nghị giá trị có thể kiểm chứng.",
    level: "Nền tảng",
    accent: "#c7ff35",
    instructor: "Khương Nguyễn",
    lessons: [
      { slug: "ban-do-90-ngay", title: "Bản đồ 90 ngày", duration: "12 phút", order: 1, preview: true, content: ["Đừng bắt đầu bằng việc làm nhiều hơn. Hãy bắt đầu bằng việc chọn đúng đích đến có thể đo lường.", "Trong bài này, bạn sẽ xác định một chỉ số kết quả, ba chỉ số dẫn đường và nhịp rà soát hằng tuần cho 90 ngày tới."] },
      { slug: "chon-thi-truong", title: "Chọn thị trường đủ hẹp", duration: "18 phút", order: 2, content: ["Một thị trường tốt không cần quá lớn ở ngày đầu. Nó cần đủ rõ để bạn biết chính xác mình đang giúp ai.", "Dùng ba bộ lọc: vấn đề có thật, khả năng chi trả và lợi thế tiếp cận của bạn."] },
      { slug: "loi-hua-gia-tri", title: "Lời hứa giá trị", duration: "21 phút", order: 3, content: ["Lời hứa giá trị mạnh mô tả một sự chuyển đổi cụ thể, không phải danh sách tính năng.", "Viết lại đề nghị của bạn theo cấu trúc: giúp ai, đạt kết quả gì, trong điều kiện nào."] },
      { slug: "kiem-chung-nhanh", title: "Kiểm chứng trước khi xây", duration: "16 phút", order: 4, content: ["Bằng chứng thị trường nên xuất hiện trước sản phẩm hoàn chỉnh.", "Thực hiện năm cuộc trò chuyện vấn đề và một đề nghị thử nghiệm nhỏ trong tuần này."] },
    ],
  },
  {
    slug: "he-thong-noi-dung-chuyen-doi",
    code: "KV-02",
    title: "Hệ thống nội dung chuyển đổi",
    description: "Biến chuyên môn thành nội dung nhất quán, đúng người và dẫn tới hành động.",
    level: "Thực hành",
    accent: "#5ef0c0",
    instructor: "Khương Nguyễn",
    lessons: [
      { slug: "tru-noi-dung", title: "Thiết kế trụ nội dung", duration: "15 phút", order: 1, preview: true, content: ["Trụ nội dung giúp bạn nói sâu mà không lặp lại.", "Chọn ba trụ: vấn đề người học đang gặp, phương pháp bạn tin và bằng chứng từ thực tế."] },
      { slug: "mot-y-tuong-nhieu-dinh-dang", title: "Một ý tưởng, nhiều định dạng", duration: "19 phút", order: 2, content: ["Không cần tạo mới mỗi ngày. Một ý tưởng tốt có thể sống dưới nhiều góc nhìn.", "Chuyển một bài dài thành hook, checklist, case study và video ngắn."] },
      { slug: "cta-tu-nhien", title: "CTA tự nhiên", duration: "14 phút", order: 3, content: ["Lời kêu gọi hành động tốt là bước tiếp theo hợp lý của nội dung.", "Khớp CTA với mức độ sẵn sàng: lưu lại, trả lời, đăng ký hoặc đặt lịch."] },
    ],
  },
  {
    slug: "van-hanh-tinh-gon",
    code: "KV-03",
    title: "Vận hành tinh gọn cho solo business",
    description: "Thiết kế nhịp làm việc, dashboard và quy trình không phụ thuộc cảm hứng.",
    level: "Tăng trưởng",
    accent: "#8aa4ff",
    instructor: "Khương Nguyễn",
    lessons: [
      { slug: "he-thong-tuan", title: "Hệ thống điều hành tuần", duration: "17 phút", order: 1, preview: true, content: ["Một tuần tốt bắt đầu từ ba ưu tiên, không phải danh sách 30 việc.", "Thiết kế nhịp lên kế hoạch, thực thi sâu và review để hệ thống tự sửa sai."] },
      { slug: "dashboard-toi-gian", title: "Dashboard tối giản", duration: "20 phút", order: 2, content: ["Dashboard chỉ hữu ích khi nó thay đổi quyết định.", "Giữ một chỉ số kết quả, ba chỉ số dẫn đường và một vùng ghi nhận bài học."] },
      { slug: "tu-dong-hoa-dung-cho", title: "Tự động hóa đúng chỗ", duration: "22 phút", order: 3, content: ["Đừng tự động hóa một quy trình còn mơ hồ.", "Chuẩn hóa trước, đo tần suất và chỉ tự động hóa phần lặp lại có quy tắc rõ."] },
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  return { course, lesson: course?.lessons.find((item) => item.slug === lessonSlug) };
}
