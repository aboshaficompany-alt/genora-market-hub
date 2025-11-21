-- إنشاء جدول تقييمات المتاجر
CREATE TABLE public.store_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(store_id, user_id)
);

-- تفعيل RLS
ALTER TABLE public.store_reviews ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة التقييمات
CREATE POLICY "الجميع يمكنهم قراءة تقييمات المتاجر"
ON public.store_reviews
FOR SELECT
USING (true);

-- المستخدمون يمكنهم إضافة تقييماتهم
CREATE POLICY "المستخدمون يمكنهم إضافة تقييمات"
ON public.store_reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- المستخدمون يمكنهم تحديث تقييماتهم
CREATE POLICY "المستخدمون يمكنهم تحديث تقييماتهم"
ON public.store_reviews
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- المستخدمون يمكنهم حذف تقييماتهم
CREATE POLICY "المستخدمون يمكنهم حذف تقييماتهم"
ON public.store_reviews
FOR DELETE
USING (auth.uid() = user_id);

-- إضافة trigger لتحديث updated_at
CREATE TRIGGER update_store_reviews_updated_at
BEFORE UPDATE ON public.store_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- دالة لتحديث تقييم المتجر تلقائياً
CREATE OR REPLACE FUNCTION public.update_store_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.stores
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.store_reviews
    WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
  )
  WHERE id = COALESCE(NEW.store_id, OLD.store_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- إضافة triggers لتحديث تقييم المتجر
CREATE TRIGGER update_store_rating_on_insert
AFTER INSERT ON public.store_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_store_rating();

CREATE TRIGGER update_store_rating_on_update
AFTER UPDATE ON public.store_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_store_rating();

CREATE TRIGGER update_store_rating_on_delete
AFTER DELETE ON public.store_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_store_rating();