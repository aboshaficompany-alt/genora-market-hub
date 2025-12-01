-- Create payment_methods table for storing vendor payment gateway configurations
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Payment gateway type
  gateway_type TEXT NOT NULL, -- 'stripe', 'paypal', 'tap', 'moyasar', 'bank_transfer', etc.
  
  -- Gateway credentials (encrypted)
  api_key TEXT,
  secret_key TEXT,
  merchant_id TEXT,
  
  -- Bank transfer details
  bank_name TEXT,
  account_number TEXT,
  iban TEXT,
  account_holder_name TEXT,
  
  -- Status and configuration
  is_active BOOLEAN DEFAULT false,
  is_test_mode BOOLEAN DEFAULT true,
  
  -- Additional settings
  settings JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Vendors can manage their own payment methods
CREATE POLICY "التجار يمكنهم إدارة وسائل الدفع الخاصة بهم"
  ON public.payment_methods
  FOR ALL
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Admins can view all payment methods
CREATE POLICY "المدراء يمكنهم قراءة جميع وسائل الدفع"
  ON public.payment_methods
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_payment_methods_store_id ON public.payment_methods(store_id);
CREATE INDEX idx_payment_methods_vendor_id ON public.payment_methods(vendor_id);

-- Update trigger
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();