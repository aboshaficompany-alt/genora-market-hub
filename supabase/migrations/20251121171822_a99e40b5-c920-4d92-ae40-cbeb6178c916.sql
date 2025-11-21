-- إنشاء جدول الباقات
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  price NUMERIC NOT NULL,
  duration_months INTEGER NOT NULL,
  max_products INTEGER,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إضافة عمود الباقة إلى جدول المتاجر
ALTER TABLE public.stores 
ADD COLUMN plan_id UUID REFERENCES public.subscription_plans(id),
ADD COLUMN subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN commercial_registration TEXT,
ADD COLUMN bank_account TEXT;

-- تفعيل RLS على جدول الباقات
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- سياسة قراءة الباقات للجميع
CREATE POLICY "الجميع يمكنهم قراءة الباقات"
ON public.subscription_plans
FOR SELECT
USING (is_active = true);

-- إدراج باقات افتراضية
INSERT INTO public.subscription_plans (name_ar, name_en, description_ar, price, duration_months, max_products, features, display_order) VALUES
('الباقة التجريبية', 'Trial Plan', 'مثالية للبدء وتجربة المنصة', 0, 1, 10, 
'["10 منتجات كحد أقصى", "دعم فني أساسي", "صفحة متجر واحدة", "تقارير شهرية"]'::jsonb, 1),

('الباقة الأساسية', 'Basic Plan', 'للمتاجر الصغيرة والناشئة', 299, 1, 50,
'["50 منتج كحد أقصى", "دعم فني متقدم", "صفحة متجر مخصصة", "تقارير أسبوعية", "ربط مواقع التواصل", "إدارة الطلبات"]'::jsonb, 2),

('الباقة المتقدمة', 'Professional Plan', 'للمتاجر المتوسطة والمتنامية', 599, 1, 200,
'["200 منتج كحد أقصى", "دعم فني على مدار الساعة", "تصميم متجر متقدم", "تقارير يومية", "أدوات تسويقية", "تحليلات متقدمة", "أولوية في الظهور", "خصومات وعروض"]'::jsonb, 3),

('الباقة المميزة', 'Premium Plan', 'للمتاجر الكبيرة والعلامات التجارية', 999, 1, NULL,
'["منتجات غير محدودة", "دعم فني VIP", "تصميم حصري للمتجر", "تقارير فورية", "أدوات تسويق متكاملة", "API مخصص", "مدير حساب خاص", "ظهور مميز", "حملات إعلانية"]'::jsonb, 4);