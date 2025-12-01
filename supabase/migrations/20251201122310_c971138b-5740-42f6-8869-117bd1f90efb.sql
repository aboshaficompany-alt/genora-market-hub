-- إضافة حقول الدفع إلى جدول الطلبات
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_gateway TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_amount NUMERIC,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;

-- تحديث الطلبات الموجودة
UPDATE public.orders
SET payment_gateway = payment_method::TEXT
WHERE payment_gateway IS NULL;

-- إنشاء دالة لحساب إجمالي المبيعات حسب البوابة
CREATE OR REPLACE FUNCTION calculate_payment_gateway_stats(
  p_store_id UUID DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  gateway TEXT,
  total_amount NUMERIC,
  total_orders BIGINT,
  successful_payments BIGINT,
  pending_payments BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.payment_gateway,
    COALESCE(SUM(o.total_amount), 0) as total_amount,
    COUNT(o.id) as total_orders,
    COUNT(o.id) FILTER (WHERE o.payment_status = 'completed') as successful_payments,
    COUNT(o.id) FILTER (WHERE o.payment_status = 'pending') as pending_payments
  FROM orders o
  WHERE 
    (p_store_id IS NULL OR EXISTS (
      SELECT 1 FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = o.id AND p.store_id = p_store_id
    ))
    AND (p_start_date IS NULL OR o.created_at >= p_start_date)
    AND (p_end_date IS NULL OR o.created_at <= p_end_date)
  GROUP BY o.payment_gateway
  ORDER BY total_amount DESC;
END;
$$;