-- إصلاح صلاحيات user_roles للسماح بتسجيل التجار

-- حذف السياسة القديمة
DROP POLICY IF EXISTS "المدراء فقط يمكنهم إدراج الأدوار" ON public.user_roles;

-- السماح للمدراء بإدراج جميع الأدوار
CREATE POLICY "المدراء يمكنهم إدراج الأدوار"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- السماح للمستخدمين بإضافة دور vendor لأنفسهم فقط
CREATE POLICY "المستخدمون يمكنهم تسجيل أنفسهم كتجار"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id AND role = 'vendor');