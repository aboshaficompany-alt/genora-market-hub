-- إضافة صلاحيات المدير للموافقة على المتاجر

-- السماح للمدراء بتحديث أي متجر
CREATE POLICY "المدراء يمكنهم تحديث المتاجر"
ON public.stores
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- السماح للمدراء بحذف المتاجر
CREATE POLICY "المدراء يمكنهم حذف المتاجر"
ON public.stores
FOR DELETE
USING (has_role(auth.uid(), 'admin'));