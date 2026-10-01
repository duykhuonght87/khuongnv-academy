-- Production readiness: complete LMS catalog, settings and admin permissions.

create table if not exists public.site_settings (
  id text primary key default 'default',
  academy_name text not null default 'KhươngNV Academy',
  tagline text not null default 'Làm chủ ChatGPT — Đóng gói chuyên môn — Xây dựng Doanh nghiệp Một Người',
  support_email text not null default 'support@khuongnv.academy',
  community_url text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
drop policy if exists "Settings are publicly readable" on public.site_settings;
create policy "Settings are publicly readable" on public.site_settings for select using (true);
drop policy if exists "Admins manage settings" on public.site_settings;
create policy "Admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins update profiles" on public.profiles;
create policy "Admins update profiles" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (id) values ('default') on conflict (id) do nothing;

alter table public.courses
  add column if not exists thumbnail_url text,
  add column if not exists position integer not null default 0,
  add column if not exists lesson_count integer not null default 0;

insert into public.products (slug, name, description, price_amount, product_type, status)
values
  ('ban-do-doanh-nghiep-mot-nguoi', 'Bản đồ Doanh nghiệp Một Người', 'Tài liệu nhập môn miễn phí.', 0, 'free', 'active'),
  ('landing-page-chatgpt', 'Landing Page bằng ChatGPT', 'Tạo landing page chuyển đổi với ChatGPT.', 49000, 'course', 'active'),
  ('dong-goi-chuyen-mon', 'Đóng gói chuyên môn bằng ChatGPT', 'Biến chuyên môn thành sản phẩm có thể bán.', 799000, 'course', 'active'),
  ('opc-4-tuan', 'OPC 4 tuần', 'Chương trình xây doanh nghiệp một người.', 1299000, 'program', 'active'),
  ('mentoring-1-1', 'Mentoring 1:1', 'Đồng hành chiến lược cùng Khương Nguyễn.', 4999000, 'service', 'hidden')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_amount = excluded.price_amount,
  product_type = excluded.product_type;

update public.courses set product_id = (select id from public.products where slug = 'ban-do-doanh-nghiep-mot-nguoi') where slug = 'nen-mong-kinh-doanh-so';
update public.courses set product_id = (select id from public.products where slug = 'dong-goi-chuyen-mon') where slug = 'he-thong-noi-dung-chuyen-doi';
update public.courses set product_id = (select id from public.products where slug = 'opc-4-tuan') where slug = 'van-hanh-tinh-gon';

insert into public.courses (slug, code, title, description, level, status, product_id)
values
  ('lam-chu-chatgpt', 'OPC-01', 'Làm chủ ChatGPT', 'Tư duy nền tảng và kỹ thuật làm việc hiệu quả với AI.', 'Level 1', 'published', (select id from public.products where slug = 'opc-4-tuan')),
  ('dong-goi-chuyen-mon', 'OPC-02', 'Đóng gói chuyên môn', 'Biến kinh nghiệm thành hệ thống và sản phẩm có thể bán.', 'Level 2', 'published', (select id from public.products where slug = 'opc-4-tuan')),
  ('tao-san-pham-so', 'OPC-03', 'Tạo sản phẩm số', 'Từ ý tưởng đến sản phẩm phiên bản đầu tiên.', 'Level 3', 'published', (select id from public.products where slug = 'opc-4-tuan')),
  ('content-machine', 'OPC-04', 'Content Machine', 'Xây cỗ máy nội dung nhất quán bằng AI.', 'Level 4', 'published', (select id from public.products where slug = 'opc-4-tuan')),
  ('landing-page-funnel', 'OPC-05', 'Landing Page & Funnel', 'Thiết kế hành trình chuyển đổi tinh gọn.', 'Level 5', 'published', (select id from public.products where slug = 'opc-4-tuan')),
  ('automation', 'OPC-06', 'Automation', 'Tự động hóa vận hành doanh nghiệp một người.', 'Level 6', 'published', (select id from public.products where slug = 'opc-4-tuan'))
on conflict (slug) do update set
  code = excluded.code,
  title = excluded.title,
  description = excluded.description,
  level = excluded.level,
  status = excluded.status,
  product_id = excluded.product_id,
  updated_at = now();

update public.courses set position = case slug
  when 'lam-chu-chatgpt' then 1 when 'dong-goi-chuyen-mon' then 2 when 'tao-san-pham-so' then 3
  when 'content-machine' then 4 when 'landing-page-funnel' then 5 when 'automation' then 6 else position end,
  lesson_count = case when code like 'OPC-%' then 2 else lesson_count end
where code like 'OPC-%';

create unique index if not exists course_modules_course_position_key on public.course_modules(course_id, position);

insert into public.course_modules (course_id, title, description, position)
select c.id, module_data.title, module_data.description, module_data.position
from public.courses c
join (values
  ('lam-chu-chatgpt', 'Nền tảng làm việc với AI', 'Thiết lập tư duy và quy trình làm việc với ChatGPT.', 1),
  ('dong-goi-chuyen-mon', 'Từ kinh nghiệm đến tài sản', 'Chọn chuyên môn và chuẩn hóa phương pháp.', 1),
  ('tao-san-pham-so', 'Sản phẩm phiên bản đầu', 'Thiết kế, kiểm chứng và hoàn thiện MVP.', 1),
  ('content-machine', 'Hệ thống nội dung', 'Xây trụ cột và lịch xuất bản nhất quán.', 1),
  ('landing-page-funnel', 'Hành trình chuyển đổi', 'Thiết kế trang đích và chuỗi hành động.', 1),
  ('automation', 'Vận hành tự động', 'Chọn quy trình và kết nối công cụ.', 1)
) as module_data(course_slug, title, description, position) on module_data.course_slug = c.slug
on conflict (course_id, position) do update set title = excluded.title, description = excluded.description, updated_at = now();

insert into public.lessons (course_id, module_id, slug, title, content, duration_minutes, position, is_preview, status)
select c.id, m.id, lesson_data.slug, lesson_data.title, lesson_data.content, lesson_data.duration, lesson_data.position, lesson_data.is_preview, 'published'
from public.courses c
join public.course_modules m on m.course_id = c.id and m.position = 1
join (values
  ('lam-chu-chatgpt', 'ban-do-chatgpt', 'Bản đồ năng lực ChatGPT', 'Xác định những việc AI nên hỗ trợ trong công việc và kinh doanh.', 14, 1, true),
  ('lam-chu-chatgpt', 'prompt-co-cau-truc', 'Prompt có cấu trúc', 'Tạo yêu cầu rõ bối cảnh, đầu ra và tiêu chí chất lượng.', 18, 2, false),
  ('dong-goi-chuyen-mon', 'chon-ket-qua-dau-ra', 'Chọn kết quả đầu ra', 'Chuyển chuyên môn thành một kết quả cụ thể cho khách hàng.', 16, 1, true),
  ('dong-goi-chuyen-mon', 'khung-phuong-phap', 'Xây khung phương pháp', 'Chuẩn hóa các bước để kết quả có thể được lặp lại.', 22, 2, false),
  ('tao-san-pham-so', 'xac-dinh-mvp', 'Xác định MVP', 'Chọn phiên bản nhỏ nhất có thể giao và kiểm chứng.', 17, 1, true),
  ('tao-san-pham-so', 'kiem-chung-nhu-cau', 'Kiểm chứng nhu cầu', 'Thu thập tín hiệu thật trước khi đầu tư sản xuất.', 20, 2, false),
  ('content-machine', 'tru-cot-noi-dung', 'Thiết kế trụ cột nội dung', 'Xây hệ chủ đề bám sát khách hàng và sản phẩm.', 19, 1, true),
  ('content-machine', 'lich-xuat-ban', 'Lịch xuất bản tinh gọn', 'Tạo nhịp sản xuất nội dung có thể duy trì.', 18, 2, false),
  ('landing-page-funnel', 'cau-truc-landing-page', 'Cấu trúc landing page', 'Sắp xếp thông điệp để dẫn người đọc đến hành động.', 21, 1, true),
  ('landing-page-funnel', 'funnel-toi-gian', 'Funnel tối giản', 'Kết nối landing page với quy trình theo dõi khách hàng.', 23, 2, false),
  ('automation', 'ban-do-quy-trinh', 'Bản đồ quy trình', 'Nhận diện tác vụ lặp lại và điểm nên tự động hóa.', 18, 1, true),
  ('automation', 'thiet-ke-automation', 'Thiết kế automation', 'Tạo luồng tự động có điểm kiểm soát và phương án dự phòng.', 24, 2, false)
) as lesson_data(course_slug, slug, title, content, duration, position, is_preview) on lesson_data.course_slug = c.slug
on conflict (course_id, slug) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  content = excluded.content,
  duration_minutes = excluded.duration_minutes,
  position = excluded.position,
  is_preview = excluded.is_preview,
  status = excluded.status,
  updated_at = now();

update public.lessons set status = 'published' where course_id in (select id from public.courses where status = 'published');
