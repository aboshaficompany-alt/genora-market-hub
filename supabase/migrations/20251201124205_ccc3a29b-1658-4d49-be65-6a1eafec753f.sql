-- حذف السياسات القديمة وإضافة سياسات محدثة
DROP POLICY IF EXISTS "التجار يمكنهم رفع صور منتجاتهم" ON storage.objects;
DROP POLICY IF EXISTS "التجار يمكنهم حذف صور منتجاتهم" ON storage.objects;

-- إنشاء سياسات جديدة تستخدم store_id بدلاً من user_id
CREATE POLICY "التجار يمكنهم رفع صور منتجاتهم"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM public.stores WHERE vendor_id = auth.uid()
  )
);

CREATE POLICY "التجار يمكنهم حذف صور منتجاتهم"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM public.stores WHERE vendor_id = auth.uid()
  )
);

CREATE POLICY "التجار يمكنهم تحديث صور منتجاتهم"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM public.stores WHERE vendor_id = auth.uid()
  )
);