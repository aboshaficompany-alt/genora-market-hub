-- Create store_categories table (أصناف المتجر الداخلية)
CREATE TABLE IF NOT EXISTS public.store_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_store_categories_store_id ON public.store_categories(store_id);

-- Enable RLS
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "الجميع يمكنهم قراءة أصناف المتاجر النشطة"
ON public.store_categories
FOR SELECT
USING (is_active = true);

CREATE POLICY "التجار يمكنهم إدارة أصناف متاجرهم"
ON public.store_categories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = store_categories.store_id
    AND stores.vendor_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = store_categories.store_id
    AND stores.vendor_id = auth.uid()
  )
);

CREATE POLICY "المدراء يمكنهم إدارة جميع الأصناف"
ON public.store_categories
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add store_category_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS store_category_id UUID REFERENCES public.store_categories(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_products_store_category_id ON public.products(store_category_id);

-- Update trigger for store_categories
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_store_categories_updated_at
BEFORE UPDATE ON public.store_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();