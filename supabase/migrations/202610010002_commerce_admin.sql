alter table public.profiles
  add column if not exists phone text,
  add column if not exists source text,
  add column if not exists last_active_at timestamptz;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price_amount bigint not null default 0 check (price_amount >= 0),
  currency text not null default 'VND',
  product_type text not null default 'course',
  status text not null default 'draft' check (status in ('draft', 'active', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses add column if not exists product_id uuid references public.products(id) on delete set null;

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lessons
  add column if not exists module_id uuid references public.course_modules(id) on delete cascade,
  add column if not exists download_url text,
  add column if not exists thumbnail_url text,
  add column if not exists status text not null default 'draft' check (status in ('draft', 'published')),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.user_product_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  access_source text not null default 'manual',
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  unique(user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  source text,
  subtotal bigint not null default 0,
  discount_amount bigint not null default 0,
  total_amount bigint not null default 0,
  currency text not null default 'VND',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price bigint not null default 0,
  line_total bigint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'manual',
  provider_reference text,
  amount bigint not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activation_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  product_id uuid not null references public.products(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'used', 'disabled')),
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz,
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.course_modules enable row level security;
alter table public.user_product_access enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.activation_codes enable row level security;

create policy "Active products are public" on public.products for select using (status = 'active' or public.is_admin());
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Accessible modules are readable" on public.course_modules for select using (public.is_admin() or exists (select 1 from public.courses c join public.user_product_access a on a.product_id = c.product_id where c.id = course_modules.course_id and a.user_id = auth.uid()));
create policy "Admins manage modules" on public.course_modules for all using (public.is_admin()) with check (public.is_admin());
create policy "Users see own product access" on public.user_product_access for select using (auth.uid() = user_id or public.is_admin());
create policy "Admins manage product access" on public.user_product_access for all using (public.is_admin()) with check (public.is_admin());
create policy "Users see own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "Users see own order items" on public.order_items for select using (public.is_admin() or exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));
create policy "Admins manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy "Users see own payments" on public.payments for select using (public.is_admin() or exists (select 1 from public.orders o where o.id = payments.order_id and o.user_id = auth.uid()));
create policy "Admins manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage activation codes" on public.activation_codes for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins read all profiles" on public.profiles for select using (public.is_admin());
create policy "Admins manage courses" on public.courses for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage lessons" on public.lessons for all using (public.is_admin()) with check (public.is_admin());
create policy "Product owners read lessons" on public.lessons for select using (exists (
  select 1 from public.courses c
  join public.user_product_access a on a.product_id = c.product_id
  where c.id = lessons.course_id and a.user_id = auth.uid()
));
create policy "Admins manage enrollments" on public.enrollments for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins read all progress" on public.lesson_progress for select using (public.is_admin());

insert into public.products (slug, name, description, price_amount, product_type, status)
values
  ('ban-do-doanh-nghiep-mot-nguoi', 'Bản đồ Doanh nghiệp Một Người', 'Tài liệu nhập môn miễn phí.', 0, 'free', 'active'),
  ('landing-page-chatgpt', 'Landing Page bằng ChatGPT', 'Tạo landing page chuyển đổi với ChatGPT.', 49000, 'course', 'active'),
  ('dong-goi-chuyen-mon', 'Đóng gói chuyên môn bằng ChatGPT', 'Biến chuyên môn thành sản phẩm có thể bán.', 799000, 'course', 'active'),
  ('opc-4-tuan', 'OPC 4 tuần', 'Chương trình xây doanh nghiệp một người.', 1299000, 'program', 'active'),
  ('mentoring-1-1', 'Mentoring 1:1', 'Đồng hành chiến lược cùng Khương Nguyễn.', 4999000, 'service', 'hidden')
on conflict (slug) do update set name = excluded.name, description = excluded.description, price_amount = excluded.price_amount, product_type = excluded.product_type, status = excluded.status;

create or replace function public.redeem_activation_code(input_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  activation public.activation_codes;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into activation from public.activation_codes
    where code = upper(trim(input_code)) and status = 'active' and (expires_at is null or expires_at > now())
    for update;
  if activation.id is null then raise exception 'Invalid or used activation code'; end if;
  insert into public.user_product_access(user_id, product_id, access_source)
    values(auth.uid(), activation.product_id, 'activation_code')
    on conflict(user_id, product_id) do nothing;
  update public.activation_codes set status = 'used', used_by = auth.uid(), used_at = now(), updated_at = now() where id = activation.id;
  return activation.product_id;
end;
$$;

grant execute on function public.redeem_activation_code(text) to authenticated;
