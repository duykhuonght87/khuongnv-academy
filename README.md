# KhươngNV Academy — MVP Giai đoạn 1

Nền tảng LMS + quản lý khách hàng, đơn hàng và doanh thu bằng Next.js App Router, Supabase Auth/Postgres và Vercel.

Phạm vi MVP:

- Landing page và nhận diện KhươngNV Academy.
- Đăng nhập, đăng ký và quên mật khẩu. Google OAuth có thể bật khi đã cấu hình Google Cloud.
- Khu học viên `/hoc-vien`, roadmap OPC 6 level, khóa học, tiến độ và mã kích hoạt.
- Admin `/admin`: tổng quan, khách hàng, học viên, đơn hàng, doanh thu, sản phẩm, khóa học và mã kích hoạt.
- Schema PostgreSQL đầy đủ với RLS theo role `student`/`admin`.

## Chạy local

Yêu cầu Node.js 20.9+ và pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Không có biến Supabase, ứng dụng tự chạy ở chế độ demo:

- Học viên: nhập email/mật khẩu bất kỳ tại `/login`.
- Admin: truy cập trực tiếp `/admin`.
- Mã kích hoạt mẫu: `OPC-X8F21`.

## Kết nối Supabase

1. Tạo project tại Supabase.
2. Chạy lần lượt toàn bộ file trong `supabase/migrations` theo tên file.
3. Điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` vào `.env.local`.
4. Trong Authentication → URL Configuration, thêm `http://localhost:3000/auth/callback` và URL Vercel tương ứng vào Redirect URLs.
5. Muốn dùng Google Login, bật Google provider trong Supabase Authentication, khai báo Client ID/Secret từ Google Cloud và đặt `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`.

Schema đã bật RLS cho hồ sơ, khóa học, module, bài học, ghi danh, tiến độ, sản phẩm, quyền truy cập, đơn hàng, chi tiết đơn, thanh toán và mã kích hoạt. Học viên chỉ đọc dữ liệu của mình; admin được quản trị toàn hệ thống.

## Tạo admin đầu tiên

1. Đăng ký một tài khoản qua `/register`.
2. Mở Supabase SQL Editor.
3. Chạy câu lệnh sau với email tài khoản vừa tạo:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'email-cua-ban@example.com');
```

Sau khi đăng nhập lại, tài khoản admin được điều hướng tới `/admin`.

`SUPABASE_SERVICE_ROLE_KEY` chỉ dành cho tác vụ server tin cậy trong tương lai. MVP hiện không đưa key này xuống trình duyệt và không cần key để build.

## Deploy Vercel

1. Import repository vào Vercel, framework được nhận diện là Next.js.
2. Thêm các biến trong `.env.example` cho Production và Preview. Không thêm tiền tố `NEXT_PUBLIC_` cho service role key.
3. Build command: `pnpm build`; output giữ mặc định của Next.js.
4. Sau deploy, cập nhật `NEXT_PUBLIC_SITE_URL` và Supabase Redirect URLs bằng domain thật.

Kiểm tra trước deploy:

```bash
pnpm lint
pnpm build
```

## Cấu trúc chính

- `src/app`: route UI và callback xác thực.
- `src/components`: shell, navigation và UI dùng chung cho admin/học viên.
- `src/lib/supabase`: browser/server client và session proxy.
- `src/lib/data.ts`: nội dung khóa học mẫu.
- `src/lib/admin-data.ts`: dữ liệu demo cho admin khi chưa kết nối Supabase.
- `supabase/migrations`: schema Postgres và chính sách RLS.
