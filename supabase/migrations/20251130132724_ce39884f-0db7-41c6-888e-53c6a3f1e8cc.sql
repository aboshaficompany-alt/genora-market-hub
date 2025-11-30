-- إضافة سياسات RLS للمدراء لإدارة الفئات
CREATE POLICY "المدراء يمكنهم إدارة الفئات"
ON public.categories
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- إضافة عمود أيقونة للفئات
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📦',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- إنشاء trigger لتحديث updated_at
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();