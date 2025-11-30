-- Create branches table for stores
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for branches
CREATE POLICY "الجميع يمكنهم قراءة الفروع النشطة"
  ON public.branches FOR SELECT
  USING (is_active = true);

CREATE POLICY "التجار يمكنهم إدارة فروع متاجرهم"
  ON public.branches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = branches.store_id
      AND stores.vendor_id = auth.uid()
    )
  );

CREATE POLICY "المدراء يمكنهم إدارة جميع الفروع"
  ON public.branches FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_branches_updated_at
  BEFORE UPDATE ON public.branches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();