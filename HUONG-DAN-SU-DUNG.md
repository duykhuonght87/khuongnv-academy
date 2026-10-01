# Hướng dẫn sử dụng KhươngNV Academy

## 1. Dành cho học viên

1. Mở trang chủ và chọn **Đăng ký** để tạo tài khoản.
2. Xác nhận email theo thư Supabase gửi đến, sau đó đăng nhập.
3. Mở **Khu học viên** để xem lộ trình, tiến độ và các sản phẩm đã được cấp quyền.
4. Nếu mua hàng bằng mã, vào **Kích hoạt**, nhập mã rồi chọn **Kích hoạt ngay**.
5. Chọn khóa học đã mở khóa, xem bài học và bấm **Đánh dấu hoàn thành** để lưu tiến độ.
6. Dùng mục **Tài liệu**, **Cộng đồng**, **Hỗ trợ** và **Tài khoản** ở thanh bên.
7. Nếu quên mật khẩu, chọn **Quên mật khẩu** ở trang đăng nhập và làm theo email đặt lại mật khẩu.

## 2. Dành cho quản trị viên

Đăng nhập bằng tài khoản có vai trò `admin`, hệ thống tự chuyển đến `/admin`.

- **Tổng quan:** theo dõi doanh thu, khách hàng, số đơn và lượt ghi danh.
- **Khách hàng/Học viên:** tìm kiếm, xem chi tiết quyền truy cập và tiến độ.
- **Đơn hàng:** tìm kiếm, lọc, đổi trạng thái thanh toán và xuất CSV.
- **Doanh thu:** xem theo 7 ngày, 30 ngày hoặc tháng hiện tại; xuất báo cáo CSV.
- **Sản phẩm:** tạo, sửa giá/loại, ẩn/hiện hoặc xóa sản phẩm.
- **Khóa học:** tạo khóa học, mở **Chỉnh sửa** để quản lý module, bài học, Video URL, tài liệu tải về và quyền xem thử.
- **Mã kích hoạt:** tạo mã cho sản phẩm, sao chép và gửi cho học viên.
- **Cài đặt:** cập nhật tên hệ thống, tagline, email hỗ trợ và liên kết cộng đồng.

## 3. Quy trình mở bán đề xuất

1. Tạo hoặc kiểm tra sản phẩm, giá bán và trạng thái **Đang bán**.
2. Tạo khóa học, module, bài học; điền Video URL và Tài liệu URL.
3. Chuyển bài học và khóa học sang **Đã xuất bản** sau khi kiểm tra nội dung.
4. Tạo mã kích hoạt cho khách đã thanh toán, hoặc cấp quyền sản phẩm trong Supabase nếu dùng quy trình thủ công.
5. Kiểm tra tài khoản học viên mẫu trước khi gửi đường dẫn bán hàng.

## 4. Lưu ý vận hành

- Video và worksheet là nội dung riêng của Academy; cần nhập đường dẫn thật trong màn chỉnh sửa khóa học.
- Chỉ tài khoản admin mới truy cập được khu quản trị.
- Không chia sẻ `SUPABASE_SERVICE_ROLE_KEY`; frontend chỉ dùng anon key và được bảo vệ bằng RLS.
- Google Login chỉ hiện khi Google Cloud/Supabase đã cấu hình và biến `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`.
