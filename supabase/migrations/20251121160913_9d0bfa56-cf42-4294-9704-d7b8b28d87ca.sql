-- إنشاء enum للأدوار
create type public.app_role as enum ('admin', 'vendor', 'customer');

-- إنشاء enum لحالة الطلب
create type public.order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- إنشاء enum لطريقة الدفع
create type public.payment_method as enum ('credit_card', 'cash_on_delivery', 'bank_transfer');

-- جدول الملفات الشخصية
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- جدول أدوار المستخدمين
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- جدول المتاجر
create table public.stores (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  image_url text,
  category text,
  rating numeric(2,1) default 0,
  verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- جدول المنتجات
create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  image_url text,
  category text,
  in_stock boolean default true,
  rating numeric(2,1) default 0,
  reviews_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- جدول الطلبات
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  status order_status default 'pending',
  total_amount numeric(10,2) not null,
  payment_method payment_method not null,
  shipping_name text not null,
  shipping_email text not null,
  shipping_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- جدول عناصر الطلب
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_price numeric(10,2) not null,
  quantity integer not null,
  subtotal numeric(10,2) not null,
  created_at timestamp with time zone default now()
);

-- جدول المراجعات
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(product_id, user_id)
);

-- تفعيل RLS على جميع الجداول
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

-- دالة للتحقق من دور المستخدم
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- سياسات RLS للملفات الشخصية
create policy "المستخدمون يمكنهم قراءة جميع الملفات الشخصية"
  on public.profiles for select
  using (true);

create policy "المستخدمون يمكنهم تحديث ملفهم الشخصي"
  on public.profiles for update
  using (auth.uid() = id);

create policy "المستخدمون يمكنهم إدراج ملفهم الشخصي"
  on public.profiles for insert
  with check (auth.uid() = id);

-- سياسات RLS لأدوار المستخدمين
create policy "الجميع يمكنهم قراءة الأدوار"
  on public.user_roles for select
  using (true);

create policy "المدراء فقط يمكنهم إدراج الأدوار"
  on public.user_roles for insert
  with check (public.has_role(auth.uid(), 'admin'));

-- سياسات RLS للمتاجر
create policy "الجميع يمكنهم قراءة المتاجر"
  on public.stores for select
  using (true);

create policy "التجار يمكنهم إنشاء متاجرهم"
  on public.stores for insert
  with check (public.has_role(auth.uid(), 'vendor') and auth.uid() = vendor_id);

create policy "التجار يمكنهم تحديث متاجرهم"
  on public.stores for update
  using (auth.uid() = vendor_id);

-- سياسات RLS للمنتجات
create policy "الجميع يمكنهم قراءة المنتجات"
  on public.products for select
  using (true);

create policy "التجار يمكنهم إنشاء منتجاتهم"
  on public.products for insert
  with check (
    exists (
      select 1 from public.stores
      where stores.id = store_id
      and stores.vendor_id = auth.uid()
    )
  );

create policy "التجار يمكنهم تحديث منتجاتهم"
  on public.products for update
  using (
    exists (
      select 1 from public.stores
      where stores.id = store_id
      and stores.vendor_id = auth.uid()
    )
  );

create policy "التجار يمكنهم حذف منتجاتهم"
  on public.products for delete
  using (
    exists (
      select 1 from public.stores
      where stores.id = store_id
      and stores.vendor_id = auth.uid()
    )
  );

-- سياسات RLS للطلبات
create policy "المستخدمون يمكنهم قراءة طلباتهم"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "التجار يمكنهم قراءة طلبات منتجاتهم"
  on public.orders for select
  using (
    exists (
      select 1 from public.order_items oi
      join public.products p on p.id = oi.product_id
      join public.stores s on s.id = p.store_id
      where oi.order_id = orders.id
      and s.vendor_id = auth.uid()
    )
  );

create policy "المستخدمون يمكنهم إنشاء طلباتهم"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "التجار يمكنهم تحديث حالة الطلبات"
  on public.orders for update
  using (
    exists (
      select 1 from public.order_items oi
      join public.products p on p.id = oi.product_id
      join public.stores s on s.id = p.store_id
      where oi.order_id = orders.id
      and s.vendor_id = auth.uid()
    )
  );

-- سياسات RLS لعناصر الطلب
create policy "المستخدمون يمكنهم قراءة عناصر طلباتهم"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "التجار يمكنهم قراءة عناصر طلبات منتجاتهم"
  on public.order_items for select
  using (
    exists (
      select 1 from public.products p
      join public.stores s on s.id = p.store_id
      where p.id = product_id
      and s.vendor_id = auth.uid()
    )
  );

create policy "المستخدمون يمكنهم إنشاء عناصر طلباتهم"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_id
      and orders.user_id = auth.uid()
    )
  );

-- سياسات RLS للمراجعات
create policy "الجميع يمكنهم قراءة المراجعات"
  on public.reviews for select
  using (true);

create policy "المستخدمون يمكنهم إنشاء مراجعاتهم"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "المستخدمون يمكنهم تحديث مراجعاتهم"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "المستخدمون يمكنهم حذف مراجعاتهم"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- دالة لإنشاء ملف شخصي عند إنشاء مستخدم جديد
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  
  -- إضافة دور العميل افتراضياً
  insert into public.user_roles (user_id, role)
  values (new.id, 'customer');
  
  return new;
end;
$$;

-- trigger لإنشاء ملف شخصي تلقائياً
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- دالة لتحديث تقييم المنتج
create or replace function public.update_product_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.products
  set 
    rating = (
      select coalesce(avg(rating), 0)
      from public.reviews
      where product_id = new.product_id
    ),
    reviews_count = (
      select count(*)
      from public.reviews
      where product_id = new.product_id
    )
  where id = new.product_id;
  
  return new;
end;
$$;

-- trigger لتحديث تقييم المنتج عند إضافة أو تحديث أو حذف مراجعة
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_product_rating();

-- دالة لتحديث updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- triggers لتحديث updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_stores_updated_at
  before update on public.stores
  for each row execute procedure public.update_updated_at_column();

create trigger update_products_updated_at
  before update on public.products
  for each row execute procedure public.update_updated_at_column();

create trigger update_orders_updated_at
  before update on public.orders
  for each row execute procedure public.update_updated_at_column();

create trigger update_reviews_updated_at
  before update on public.reviews
  for each row execute procedure public.update_updated_at_column();