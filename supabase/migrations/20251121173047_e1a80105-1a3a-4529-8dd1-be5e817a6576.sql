-- إنشاء buckets للصور
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('store-logos', 'store-logos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('id-images', 'id-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

-- سياسات الأمان لـ store-logos (عام)
create policy "الجميع يمكنهم عرض شعارات المتاجر"
on storage.objects for select
using (bucket_id = 'store-logos');

create policy "التجار يمكنهم رفع شعارات متاجرهم"
on storage.objects for insert
with check (
  bucket_id = 'store-logos' 
  and auth.role() = 'authenticated'
);

create policy "التجار يمكنهم تحديث شعارات متاجرهم"
on storage.objects for update
using (
  bucket_id = 'store-logos' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "التجار يمكنهم حذف شعارات متاجرهم"
on storage.objects for delete
using (
  bucket_id = 'store-logos' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- سياسات الأمان لـ id-images (خاص)
create policy "المستخدمون يمكنهم عرض صور هوياتهم"
on storage.objects for select
using (
  bucket_id = 'id-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "المستخدمون يمكنهم رفع صور هوياتهم"
on storage.objects for insert
with check (
  bucket_id = 'id-images' 
  and auth.role() = 'authenticated'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "المستخدمون يمكنهم تحديث صور هوياتهم"
on storage.objects for update
using (
  bucket_id = 'id-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "المستخدمون يمكنهم حذف صور هوياتهم"
on storage.objects for delete
using (
  bucket_id = 'id-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- المدراء يمكنهم عرض جميع صور الهويات
create policy "المدراء يمكنهم عرض جميع صور الهويات"
on storage.objects for select
using (
  bucket_id = 'id-images' 
  and has_role(auth.uid(), 'admin'::app_role)
);