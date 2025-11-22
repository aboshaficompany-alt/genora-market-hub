-- إضافة حقل store_url وتكلفة الشحن إلى جدول المتاجر
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS store_url text GENERATED ALWAYS AS ('https://app.lovable.app/store/' || id) STORED,
ADD COLUMN IF NOT EXISTS shipping_cost numeric DEFAULT 0;

-- إنشاء جدول شركات الشحن
CREATE TABLE IF NOT EXISTS public.shipping_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cost numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- إضافة شركة الشروق كافتراضي
INSERT INTO public.shipping_companies (name, cost, is_active)
VALUES ('شركة الشروق لتوصيل الأطعمة', 10, true);

-- إنشاء جدول البانرات
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  link text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- إنشاء جدول طلبات السحب
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.profiles(id),
  store_id uuid NOT NULL REFERENCES public.stores(id),
  amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- إنشاء جدول المديونيات
CREATE TABLE IF NOT EXISTS public.debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.profiles(id),
  store_id uuid NOT NULL REFERENCES public.stores(id),
  amount numeric NOT NULL,
  description text,
  is_paid boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.shipping_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لشركات الشحن
CREATE POLICY "الجميع يمكنهم قراءة شركات الشحن النشطة" 
ON public.shipping_companies FOR SELECT 
USING (is_active = true);

CREATE POLICY "المدراء يمكنهم إدارة شركات الشحن" 
ON public.shipping_companies FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- سياسات RLS للبانرات
CREATE POLICY "الجميع يمكنهم قراءة البانرات النشطة" 
ON public.banners FOR SELECT 
USING (is_active = true);

CREATE POLICY "المدراء يمكنهم إدارة البانرات" 
ON public.banners FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- سياسات RLS لطلبات السحب
CREATE POLICY "التجار يمكنهم قراءة طلبات السحب الخاصة بهم" 
ON public.withdrawal_requests FOR SELECT 
USING (vendor_id = auth.uid());

CREATE POLICY "التجار يمكنهم إنشاء طلبات السحب" 
ON public.withdrawal_requests FOR INSERT 
WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "المدراء يمكنهم قراءة وتحديث جميع طلبات السحب" 
ON public.withdrawal_requests FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- سياسات RLS للمديونيات
CREATE POLICY "التجار يمكنهم قراءة مديونياتهم" 
ON public.debts FOR SELECT 
USING (vendor_id = auth.uid());

CREATE POLICY "المدراء يمكنهم إدارة جميع المديونيات" 
ON public.debts FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- إنشاء bucket لصور المنتجات
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- سياسات Storage لصور المنتجات
CREATE POLICY "الجميع يمكنهم قراءة صور المنتجات" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "التجار يمكنهم رفع صور منتجاتهم" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "التجار يمكنهم حذف صور منتجاتهم" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Triggers للتحديث التلقائي
CREATE TRIGGER update_shipping_companies_updated_at
BEFORE UPDATE ON public.shipping_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debts_updated_at
BEFORE UPDATE ON public.debts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();