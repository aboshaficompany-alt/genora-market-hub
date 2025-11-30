-- إضافة حقول إضافية لملف المستخدم
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- إنشاء جدول لإشعارات المستخدمين
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('order', 'offer', 'system', 'promotion')),
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- سياسات RLS للإشعارات
CREATE POLICY "المستخدمون يمكنهم قراءة إشعاراتهم"
ON public.user_notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم تحديث إشعاراتهم"
ON public.user_notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- المدراء يمكنهم إنشاء إشعارات
CREATE POLICY "المدراء يمكنهم إنشاء إشعارات"
ON public.user_notifications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger لتحديث updated_at
CREATE TRIGGER update_user_notifications_updated_at
BEFORE UPDATE ON public.user_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();