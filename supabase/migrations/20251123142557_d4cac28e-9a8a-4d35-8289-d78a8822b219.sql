-- Create offers table (العروض)
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage NUMERIC NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create promo_codes table (أكواد البرومو)
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage NUMERIC CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_amount NUMERIC CHECK (discount_amount >= 0),
  max_uses INTEGER NOT NULL DEFAULT 1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  min_order_amount NUMERIC DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table (الرسائل)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'closed')),
  admin_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cities table (المدن)
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for offers
CREATE POLICY "الجميع يمكنهم قراءة العروض النشطة"
  ON public.offers FOR SELECT
  USING (is_active = true);

CREATE POLICY "المدراء يمكنهم إدارة جميع العروض"
  ON public.offers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "التجار يمكنهم إدارة عروضهم"
  ON public.offers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = offers.store_id
      AND stores.vendor_id = auth.uid()
    )
  );

-- RLS Policies for promo_codes
CREATE POLICY "الجميع يمكنهم قراءة أكواد البرومو النشطة"
  ON public.promo_codes FOR SELECT
  USING (is_active = true);

CREATE POLICY "المدراء يمكنهم إدارة أكواد البرومو"
  ON public.promo_codes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for messages
CREATE POLICY "المستخدمون يمكنهم إنشاء رسائل"
  ON public.messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "المستخدمون يمكنهم قراءة رسائلهم"
  ON public.messages FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "المدراء يمكنهم إدارة جميع الرسائل"
  ON public.messages FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cities
CREATE POLICY "الجميع يمكنهم قراءة المدن النشطة"
  ON public.cities FOR SELECT
  USING (is_active = true);

CREATE POLICY "المدراء يمكنهم إدارة المدن"
  ON public.cities FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON public.cities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();