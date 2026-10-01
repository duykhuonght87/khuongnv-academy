create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null unique,
  title text not null,
  description text not null default '',
  level text not null default 'Nền tảng',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  content text not null default '',
  video_url text,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  position integer not null default 0,
  is_preview boolean not null default false,
  created_at timestamptz not null default now(),
  unique(course_id, slug)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, course_slug, lesson_slug)
);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

create policy "Profiles are visible to their owner" on public.profiles for select using (auth.uid() = id);
create policy "Users update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Published courses are public" on public.courses for select using (status = 'published');
create policy "Preview and enrolled lessons are readable" on public.lessons for select using (
  is_preview or exists (
    select 1 from public.enrollments e where e.course_id = lessons.course_id and e.user_id = auth.uid()
  )
);
create policy "Users see their enrollments" on public.enrollments for select using (auth.uid() = user_id);
create policy "Users see their progress" on public.lesson_progress for select using (auth.uid() = user_id);
create policy "Users insert their progress" on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users update their progress" on public.lesson_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.courses (slug, code, title, description, level, status)
values
  ('nen-mong-kinh-doanh-so', 'KV-01', 'Nền móng kinh doanh số', 'Xây hệ tư duy, chọn thị trường và tạo đề nghị giá trị có thể kiểm chứng.', 'Nền tảng', 'published'),
  ('he-thong-noi-dung-chuyen-doi', 'KV-02', 'Hệ thống nội dung chuyển đổi', 'Biến chuyên môn thành nội dung nhất quán, đúng người và dẫn tới hành động.', 'Thực hành', 'published'),
  ('van-hanh-tinh-gon', 'KV-03', 'Vận hành tinh gọn cho solo business', 'Thiết kế nhịp làm việc, dashboard và quy trình không phụ thuộc cảm hứng.', 'Tăng trưởng', 'published')
on conflict (slug) do update set title = excluded.title, description = excluded.description, level = excluded.level, status = excluded.status;
