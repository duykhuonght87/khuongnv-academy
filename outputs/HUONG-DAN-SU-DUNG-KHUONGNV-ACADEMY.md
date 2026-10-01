# Hướng dẫn sử dụng và triển khai KhươngNV Academy

Tài liệu này dành cho chủ hệ thống, quản trị viên và học viên của KhươngNV Academy. Website đã hoàn thành giao diện và các luồng chính của MVP Giai đoạn 1. Bạn có thể kiểm tra ngay ở chế độ demo, sau đó kết nối Supabase, GitHub và Vercel để chạy với dữ liệu thật.

## 1. Trạng thái hiện tại

Website đã kết nối với Supabase và có các phần sau:

- Landing page giới thiệu KhươngNV Academy.
- Đăng ký, đăng nhập, quên mật khẩu và Google OAuth qua Supabase.
- Dashboard học viên, roadmap OPC 6 level và trình phát bài học.
- Lưu tiến độ học tập vào PostgreSQL khi Supabase được kết nối.
- Kích hoạt quyền truy cập sản phẩm bằng mã.
- Dashboard admin gồm khách hàng, học viên, đơn hàng, doanh thu, sản phẩm, khóa học và mã kích hoạt.
- Phân quyền `student` và `admin` bằng Supabase Auth và Row Level Security.
- Cấu hình build Next.js dành cho Vercel.

> [!CALLOUT] ⚠️
>
> Dashboard đơn hàng và doanh thu đang đọc dữ liệu thật từ các bảng `orders` và `order_items`. Khi chưa có đơn, hệ thống hiển thị `0đ` và thông báo chưa có đơn hàng. MVP chưa có cổng thanh toán hoặc webhook tự động tạo đơn; phần này nên được triển khai ở giai đoạn tiếp theo.

## 2. Kiểm tra nhanh trên máy

Website chạy tại:

- Trang chủ: `http://localhost:3000`
- Đăng nhập: `http://localhost:3000/login`
- Khu học viên: `http://localhost:3000/hoc-vien`
- Quản trị: `http://localhost:3000/admin`

Hệ thống hiện đã bật xác thực Supabase. Bạn phải dùng tài khoản đã đăng ký và xác nhận email; quyền truy cập `/admin` chỉ dành cho tài khoản có role `admin`.

Để chạy lại dự án:

```bash
pnpm install
pnpm dev
```

Trước khi đưa lên Vercel:

```bash
pnpm lint
pnpm build
```

## 3. Hướng dẫn dành cho học viên

### Đăng ký và đăng nhập

1. Mở `/register` để tạo tài khoản bằng email và mật khẩu.
2. Hoặc chọn đăng nhập Google nếu Google Provider đã được bật trong Supabase.
3. Sau khi đăng nhập thành công, tài khoản học viên được chuyển đến `/hoc-vien`.
4. Dùng `/forgot-password` nếu cần yêu cầu email đặt lại mật khẩu.

### Sử dụng dashboard học viên

Dashboard hiển thị tiến độ toàn lộ trình, level đã hoàn thành, bài học gần nhất và các sản phẩm đang sở hữu.

1. Chọn một level trong phần **Lộ trình 6 Level**.
2. Chọn bài học ở cột bên trái.
3. Xem video, đọc mô tả và tải tài liệu nếu bài học có tệp đính kèm.
4. Nhấn **Hoàn thành bài học**. Khi Supabase đã kết nối, trạng thái được lưu vào bảng `lesson_progress`.
5. Dùng **Bài trước** hoặc **Bài tiếp theo** để di chuyển giữa các bài.

### Kích hoạt sản phẩm

1. Chọn **Kích hoạt** trong sidebar.
2. Nhập mã do quản trị viên cung cấp.
3. Nhấn **Kích hoạt**.
4. Mã hợp lệ sẽ thêm quyền sản phẩm vào bảng `user_product_access` và đánh dấu mã đã sử dụng.

## 4. Hướng dẫn dành cho quản trị viên

### Tổng quan

Mở `/admin` để xem doanh thu, tổng đơn, khách hàng, học viên, phễu chuyển đổi và giao dịch gần nhất.

### Khách hàng và học viên

- **Khách hàng:** xem thông tin liên hệ, nguồn khách, sản phẩm đã mua, tổng chi tiêu và hoạt động gần nhất.
- **Chi tiết khách hàng:** mở từng hồ sơ để xem quyền sản phẩm, tiến độ và lịch sử đơn hàng.
- **Học viên:** theo dõi tiến độ lộ trình và trạng thái học tập.

### Đơn hàng và doanh thu

- **Đơn hàng:** theo dõi mã đơn, khách hàng, sản phẩm, giá trị và trạng thái thanh toán.
- **Doanh thu:** xem doanh thu theo thời gian, đóng góp theo sản phẩm, tỷ lệ thành công và hoàn tiền.
- Trang đơn hàng và dashboard chỉ hiển thị dữ liệu thật. Nếu chưa có dữ liệu, các chỉ số là `0` và bảng hiển thị thông báo chưa có đơn hàng.

### Sản phẩm và khóa học

- **Sản phẩm:** tạo sản phẩm, thay đổi trạng thái đang bán hoặc ẩn, và xóa sản phẩm.
- **Khóa học:** quản lý cấu trúc khóa học, module và bài học.
- Thay đổi sản phẩm được lưu vào Supabase khi tài khoản hiện tại có role `admin`.

### Mã kích hoạt

- Tạo mã mới cho một sản phẩm.
- Theo dõi mã chưa dùng, đã dùng hoặc bị vô hiệu hóa.
- Học viên chỉ có thể dùng mã còn hiệu lực một lần.

## 5. Kết nối Supabase

### Tạo cơ sở dữ liệu

1. Tạo project mới trên Supabase.
2. Mở **SQL Editor**.
3. Chạy lần lượt hai migration theo đúng thứ tự:
   - `supabase/migrations/202610010001_initial_academy.sql`
   - `supabase/migrations/202610010002_commerce_admin.sql`
4. Mở **Project Settings → API** để lấy Project URL và anon public key.
5. Tạo `.env.local` từ `.env.example` và điền:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` chưa cần cho các chức năng MVP hiện tại. Nếu sử dụng về sau, chỉ đặt key này trong môi trường server và tuyệt đối không thêm tiền tố `NEXT_PUBLIC_`.

### Cấu hình xác thực

Trong **Authentication → URL Configuration**:

- Site URL khi chạy local: `http://localhost:3000`
- Redirect URL local: `http://localhost:3000/auth/callback`
- Sau khi deploy, thêm `https://ten-du-an.vercel.app/auth/callback`
- Nếu dùng domain riêng, thêm `https://ten-mien-cua-ban/auth/callback`

Để dùng Google Login, bật Google Provider trong Supabase và khai báo Client ID cùng Client Secret từ Google Cloud.

### Tạo tài khoản admin đầu tiên

1. Đăng ký một tài khoản qua `/register`.
2. Mở Supabase SQL Editor.
3. Thay email trong câu lệnh sau rồi chạy:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = 'email-cua-ban@example.com'
);
```

Đăng xuất và đăng nhập lại. Tài khoản admin sẽ được chuyển đến `/admin`.

## 6. Đưa mã nguồn lên GitHub

Mã nguồn và `.gitignore` đã được chuẩn bị. Thư mục hiện chưa có repository Git. Tạo một repository trống trên GitHub, không chọn tạo thêm README hoặc `.gitignore`, rồi chạy trong thư mục dự án:

```bash
git init -b main
git add .
git commit -m "feat: complete KhuongNV Academy phase 1 MVP"
git remote add origin https://github.com/TEN-TAI-KHOAN/TEN-REPOSITORY.git
git push -u origin main
```

Nếu Git chưa có thông tin người tạo commit, cấu hình tên và email của bạn trước lệnh `git commit`:

```bash
git config user.name "TEN CUA BAN"
git config user.email "EMAIL GITHUB CUA BAN"
```

Nếu GitHub yêu cầu xác thực, sử dụng GitHub CLI hoặc Personal Access Token theo hướng dẫn của GitHub. Không đưa `.env.local`, Supabase service role key hoặc mật khẩu lên repository.

## 7. Deploy lên Vercel

1. Đăng nhập Vercel và chọn **Add New → Project**.
2. Import repository GitHub vừa tạo.
3. Vercel sẽ tự nhận diện framework Next.js.
4. Giữ Build Command là `pnpm build` và Output Directory mặc định.
5. Thêm các biến môi trường:

| Tên biến | Giá trị |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL của Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key của Supabase |
| `NEXT_PUBLIC_SITE_URL` | Domain Vercel, ví dụ `https://ten-du-an.vercel.app` |

6. Nhấn **Deploy**.
7. Sau khi deploy xong, cập nhật Site URL và Redirect URLs trong Supabase bằng domain Vercel thật.
8. Redeploy nếu bạn thay đổi biến môi trường sau lần build đầu.

## 8. Checklist kiểm tra sau deploy

- [ ] Trang chủ tải đúng trên desktop và mobile.
- [ ] Đăng ký tạo được tài khoản trong Supabase Authentication.
- [ ] Đăng nhập học viên chuyển đến `/hoc-vien`.
- [ ] Tài khoản admin chuyển đến `/admin`.
- [ ] Học viên không mở được `/admin`.
- [ ] Hoàn thành bài học tạo hoặc cập nhật bản ghi trong `lesson_progress`.
- [ ] Mã kích hoạt hợp lệ tạo quyền trong `user_product_access`.
- [ ] Admin tạo và ẩn sản phẩm được trong Supabase.
- [ ] Đơn hàng trong bảng `orders` xuất hiện tại `/admin/orders`.
- [ ] Dashboard doanh thu hiển thị đúng số liệu cần kiểm tra.
- [ ] Google Login quay về đúng `/auth/callback` nếu đã bật provider.
- [ ] Không có key bí mật trong GitHub hoặc mã nguồn phía trình duyệt.

## 9. Phạm vi nên làm ở giai đoạn tiếp theo

- Tích hợp cổng thanh toán và webhook tự động tạo đơn, giao quyền sản phẩm.
- Form quản trị đầy đủ cho module, bài học, video và tài liệu tải xuống.
- Email giao dịch cho đăng ký, thanh toán và cấp quyền.
- Bộ lọc, tìm kiếm, xuất CSV và báo cáo theo khoảng thời gian dùng dữ liệu thật.
- CRM nâng cao, ghi chú khách hàng, pipeline lead và automation.
- Cộng đồng, gamification, affiliate và thông báo.
- Monitoring, analytics, sao lưu và quy trình khôi phục dữ liệu.

## 10. Xử lý lỗi thường gặp

### Đăng nhập xong quay lại trang đăng nhập

Kiểm tra `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Site URL và Redirect URLs trong Supabase.

### Tài khoản không vào được admin

Kiểm tra bản ghi tương ứng trong bảng `profiles` có `role = 'admin'`, sau đó đăng xuất và đăng nhập lại.

### Vercel build thất bại

Chạy `pnpm lint` và `pnpm build` trên máy, kiểm tra Node.js từ phiên bản 20.9 trở lên, rồi đối chiếu Environment Variables trên Vercel.

### Trang admin chưa có đơn hàng hoặc doanh thu

Kiểm tra bảng `orders` có dữ liệu và trạng thái đơn đã thanh toán là `paid`. Khi bảng chưa có bản ghi, dashboard hiển thị `0đ`; đây là trạng thái đúng, không phải lỗi.
