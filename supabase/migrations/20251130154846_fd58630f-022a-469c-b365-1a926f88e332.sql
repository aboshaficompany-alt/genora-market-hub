-- إنشاء trigger لإرسال إشعارات للتجار عند الموافقة أو الرفض على منتجاتهم
CREATE OR REPLACE FUNCTION notify_vendor_product_status()
RETURNS TRIGGER AS $$
DECLARE
  vendor_id_var uuid;
  notification_title text;
  notification_message text;
BEGIN
  -- الحصول على معرف التاجر من المتجر
  SELECT vendor_id INTO vendor_id_var
  FROM stores
  WHERE id = NEW.store_id;

  -- التحقق من تغيير حالة الموافقة
  IF OLD.approval_status IS DISTINCT FROM NEW.approval_status THEN
    -- تحديد عنوان ورسالة الإشعار حسب الحالة
    IF NEW.approval_status = 'approved' THEN
      notification_title := 'تمت الموافقة على منتجك';
      notification_message := 'تمت الموافقة على المنتج "' || NEW.name || '" وأصبح متاحاً للعملاء';
    ELSIF NEW.approval_status = 'rejected' THEN
      notification_title := 'تم رفض منتجك';
      notification_message := 'تم رفض المنتج "' || NEW.name || '"';
      IF NEW.rejection_reason IS NOT NULL THEN
        notification_message := notification_message || '. السبب: ' || NEW.rejection_reason;
      END IF;
    ELSIF NEW.approval_status = 'pending' THEN
      notification_title := 'منتجك قيد المراجعة';
      notification_message := 'المنتج "' || NEW.name || '" قيد المراجعة من قبل الإدارة';
    END IF;

    -- إنشاء الإشعار
    INSERT INTO public.user_notifications (
      user_id,
      type,
      title,
      message,
      link
    ) VALUES (
      vendor_id_var,
      'product_status',
      notification_title,
      notification_message,
      '/vendor-products'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- إنشاء trigger على جدول المنتجات
DROP TRIGGER IF EXISTS on_product_status_change ON products;
CREATE TRIGGER on_product_status_change
  AFTER UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION notify_vendor_product_status();