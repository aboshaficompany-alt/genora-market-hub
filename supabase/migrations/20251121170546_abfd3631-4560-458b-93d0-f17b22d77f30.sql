-- إضافة حقول جديدة لجدول stores
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS owner_id_number TEXT,
ADD COLUMN IF NOT EXISTS owner_id_image_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS store_url TEXT,
ADD COLUMN IF NOT EXISTS shipping_method TEXT DEFAULT 'vendor',
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- إضافة جدول للفئات إذا لزم الأمر
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إدراج الفئات الأساسية
INSERT INTO public.categories (name_ar) VALUES 
  ('ماكولات ومشروبات'),
  ('اعمال اطفال'),
  ('هوايات وحرف'),
  ('ملابس وتجميل')
ON CONFLICT DO NOTHING;

-- تحديث RLS policies للفئات
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "الجميع يمكنهم قراءة الفئات"
ON public.categories FOR SELECT
TO authenticated, anon
USING (true);

-- إضافة policy جديدة للتجار لتحديث معلومات متاجرهم
DROP POLICY IF EXISTS "التجار يمكنهم تحديث متاجرهم" ON public.stores;

CREATE POLICY "التجار يمكنهم تحديث متاجرهم"
ON public.stores FOR UPDATE
TO authenticated
USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);