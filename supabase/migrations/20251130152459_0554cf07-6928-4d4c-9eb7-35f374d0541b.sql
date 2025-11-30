-- إضافة حقول جديدة لجدول categories للأصناف الفرعية والخصائص
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS attributes jsonb DEFAULT '[]'::jsonb;

-- إضافة تعليق توضيحي للحقول الجديدة
COMMENT ON COLUMN categories.parent_id IS 'معرف الصنف الأب للأصناف الفرعية';
COMMENT ON COLUMN categories.attributes IS 'خصائص الصنف مثل اللون والحجم والسعة';

-- إضافة فهرس للأصناف الفرعية
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- إضافة حقول جديدة لجدول products لحالة الموافقة والمتغيرات
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS attributes jsonb DEFAULT '{}'::jsonb;

-- إضافة تعليقات توضيحية
COMMENT ON COLUMN products.is_approved IS 'هل تمت الموافقة على المنتج من قبل المدير';
COMMENT ON COLUMN products.approval_status IS 'حالة الموافقة: pending, approved, rejected';
COMMENT ON COLUMN products.rejection_reason IS 'سبب رفض المنتج من قبل المدير';
COMMENT ON COLUMN products.variants IS 'متغيرات المنتج مثل اللون والحجم مع السعر والمخزون';
COMMENT ON COLUMN products.attributes IS 'خصائص المنتج المحددة';

-- تحديث RLS policies للأصناف
DROP POLICY IF EXISTS "المدراء يمكنهم إدارة الفئات" ON categories;

CREATE POLICY "المدراء يمكنهم إنشاء الفئات"
ON categories FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "المدراء يمكنهم تحديث الفئات"
ON categories FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "المدراء يمكنهم حذف الفئات"
ON categories FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- تحديث RLS policies للمنتجات
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة المنتجات" ON products;

-- الجميع يمكنهم قراءة المنتجات المعتمدة فقط
CREATE POLICY "الجميع يمكنهم قراءة المنتجات المعتمدة"
ON products FOR SELECT
TO authenticated, anon
USING (is_approved = true AND approval_status = 'approved');

-- التجار يمكنهم قراءة منتجاتهم حتى لو لم تتم الموافقة عليها
CREATE POLICY "التجار يمكنهم قراءة منتجاتهم"
ON products FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = products.store_id
    AND stores.vendor_id = auth.uid()
  )
);

-- المدراء يمكنهم قراءة جميع المنتجات
CREATE POLICY "المدراء يمكنهم قراءة جميع المنتجات"
ON products FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- المدراء يمكنهم تحديث جميع المنتجات
CREATE POLICY "المدراء يمكنهم تحديث جميع المنتجات"
ON products FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- المدراء يمكنهم حذف جميع المنتجات
CREATE POLICY "المدراء يمكنهم حذف جميع المنتجات"
ON products FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- تحديث سياسة إنشاء المنتجات للتجار
DROP POLICY IF EXISTS "التجار يمكنهم إنشاء منتجاتهم" ON products;

CREATE POLICY "التجار يمكنهم إنشاء منتجاتهم"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = products.store_id
    AND stores.vendor_id = auth.uid()
  )
);