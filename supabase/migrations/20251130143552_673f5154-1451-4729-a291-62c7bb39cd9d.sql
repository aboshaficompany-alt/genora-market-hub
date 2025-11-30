-- إصلاح سياسات RLS للمنتجات
DROP POLICY IF EXISTS "التجار يمكنهم إنشاء منتجاتهم" ON public.products;

CREATE POLICY "التجار يمكنهم إنشاء منتجاتهم"
ON public.products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = products.store_id
    AND stores.vendor_id = auth.uid()
  )
);

-- إضافة دالة لإنشاء إشعارات
CREATE OR REPLACE FUNCTION public.notify_vendor_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  vendor_ids uuid[];
  vendor_id uuid;
BEGIN
  -- الحصول على معرفات التجار من المنتجات في الطلب
  SELECT ARRAY_AGG(DISTINCT s.vendor_id)
  INTO vendor_ids
  FROM order_items oi
  JOIN products p ON p.id = oi.product_id
  JOIN stores s ON s.id = p.store_id
  WHERE oi.order_id = NEW.id;

  -- إنشاء إشعار لكل تاجر
  FOREACH vendor_id IN ARRAY vendor_ids
  LOOP
    INSERT INTO public.user_notifications (
      user_id,
      type,
      title,
      message,
      link
    ) VALUES (
      vendor_id,
      'new_order',
      'طلب جديد',
      'تم استلام طلب جديد برقم #' || SUBSTRING(NEW.id::text, 1, 8),
      '/vendor-orders'
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- إضافة دالة لإشعار العملاء بتحديث الطلب
CREATE OR REPLACE FUNCTION public.notify_customer_order_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  status_text text;
BEGIN
  -- إذا تغيرت الحالة
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- تحديد نص الحالة بالعربية
    status_text := CASE NEW.status
      WHEN 'pending' THEN 'قيد الانتظار'
      WHEN 'confirmed' THEN 'مؤكد'
      WHEN 'shipped' THEN 'تم الشحن'
      WHEN 'delivered' THEN 'تم التسليم'
      WHEN 'cancelled' THEN 'ملغي'
      ELSE NEW.status::text
    END;

    -- إنشاء إشعار للعميل
    INSERT INTO public.user_notifications (
      user_id,
      type,
      title,
      message,
      link
    ) VALUES (
      NEW.user_id,
      'order_update',
      'تحديث حالة الطلب',
      'تم تحديث حالة طلبك #' || SUBSTRING(NEW.id::text, 1, 8) || ' إلى: ' || status_text,
      '/order-history'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- إضافة triggers
DROP TRIGGER IF EXISTS notify_vendor_on_new_order ON public.orders;
CREATE TRIGGER notify_vendor_on_new_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_vendor_new_order();

DROP TRIGGER IF EXISTS notify_customer_on_order_update ON public.orders;
CREATE TRIGGER notify_customer_on_order_update
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_customer_order_update();

-- إضافة عمود category_id للمنتجات للربط بجدول الفئات
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id);

-- إنشاء index لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON public.user_notifications(is_read);