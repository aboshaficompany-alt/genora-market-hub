import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Building2, MapPin, Phone, User, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { LocationInput } from "@/components/LocationInput";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
    pickupLat: null as number | null,
    pickupLng: null as number | null,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        variant: "destructive",
        title: "يجب تسجيل الدخول",
        description: "قم بتسجيل الدخول لإتمام عملية الشراء",
      });
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    loadPaymentMethods();
  }, [items]);

  const loadPaymentMethods = async () => {
    if (items.length === 0) return;

    try {
      // Get product IDs from cart (convert to string)
      const productIds = items.map(item => String(item.id));
      
      // Fetch products to get their store IDs
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("store_id")
        .in("id", productIds);

      if (productsError) throw productsError;

      // Get unique store IDs
      const storeIds = [...new Set(products?.map(p => p.store_id) || [])];
      
      if (storeIds.length === 0) return;

      // Fetch active payment methods for these stores
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .in("store_id", storeIds)
        .eq("is_active", true);

      if (error) throw error;

      // Group payment methods by gateway type to avoid duplicates
      const methodsMap = new Map();
      data?.forEach(method => {
        if (!methodsMap.has(method.gateway_type)) {
          methodsMap.set(method.gateway_type, method);
        }
      });

      const methods = Array.from(methodsMap.values());
      setAvailablePaymentMethods(methods);
      
      // Set default payment method
      if (methods.length > 0 && !paymentMethod) {
        setPaymentMethod(methods[0].gateway_type);
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "الرجاء إدخال كود الخصم",
      });
      return;
    }

    setCheckingPromo(true);
    
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "كود غير صالح",
          description: "الكود المدخل غير موجود أو منتهي الصلاحية",
        });
        return;
      }

      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      if (now < startDate || now > endDate) {
        toast({
          variant: "destructive",
          title: "كود منتهي الصلاحية",
          description: "هذا الكود غير صالح للاستخدام حالياً",
        });
        return;
      }

      if (data.current_uses >= data.max_uses) {
        toast({
          variant: "destructive",
          title: "تم استخدام الكود بالكامل",
          description: "لقد تم استخدام هذا الكود الحد الأقصى من المرات",
        });
        return;
      }

      if (data.min_order_amount && totalPrice < data.min_order_amount) {
        toast({
          variant: "destructive",
          title: "الحد الأدنى للطلب",
          description: `يجب أن يكون مجموع الطلب ${data.min_order_amount} ر.س على الأقل`,
        });
        return;
      }

      setAppliedPromo(data);
      toast({
        title: "تم تطبيق الكود!",
        description: "تم تطبيق كود الخصم بنجاح",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    } finally {
      setCheckingPromo(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.discount_percentage) {
      return (totalPrice * appliedPromo.discount_percentage) / 100;
    } else if (appliedPromo.discount_amount) {
      return appliedPromo.discount_amount;
    }
    return 0;
  };

  const discount = calculateDiscount();
  const finalTotal = totalPrice - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setSubmitting(true);

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          total_amount: finalTotal,
          payment_method: paymentMethod as any,
          shipping_name: formData.name,
          shipping_email: formData.email,
          shipping_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          notes: formData.notes,
          status: "pending" as any,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: null, // Mock data doesn't have real product IDs
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update promo code usage if applied
      if (appliedPromo) {
        await supabase
          .from("promo_codes")
          .update({ current_uses: appliedPromo.current_uses + 1 })
          .eq("id", appliedPromo.id);
      }

      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب",
      });

      clearCart();
      navigate("/orders");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في إرسال الطلب",
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black text-charcoal mb-12 text-center animate-fade-in">
            إتمام <span className="bg-gradient-primary bg-clip-text text-transparent">الطلب</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card className="border-2 animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-bold text-charcoal">
                        معلومات الشحن
                      </h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4" />
                          الاسم الكامل
                        </Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="mb-2 block">
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4" />
                          رقم الجوال
                        </Label>
                        <Input
                          id="phone"
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="city" className="mb-2 block">
                          المدينة
                        </Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          placeholder="اسم المدينة"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address" className="mb-2 block">
                          العنوان التفصيلي
                        </Label>
                        <Input
                          id="address"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="الحي، الشارع، رقم المنزل"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="notes" className="mb-2 block">
                          ملاحظات إضافية (اختياري)
                        </Label>
                        <Input
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          placeholder="أي ملاحظات للتوصيل"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <LocationInput 
                          onLocationChange={(lat, lng) => 
                            setFormData({...formData, pickupLat: lat, pickupLng: lng})
                          } 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="border-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-bold text-charcoal">
                        طريقة الدفع
                      </h2>
                    </div>
                    
                    {availablePaymentMethods.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        لا توجد وسائل دفع متاحة حالياً
                      </div>
                    ) : (
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="space-y-3">
                          {availablePaymentMethods.map((method) => {
                            const gatewayConfig = {
                              stripe: {
                                label: "Stripe",
                                description: "الدفع عبر بطاقة الائتمان - Stripe",
                                icon: CreditCard,
                              },
                              tap: {
                                label: "Tap Payments",
                                description: "الدفع عبر Tap Payments",
                                icon: CreditCard,
                              },
                              paypal: {
                                label: "PayPal",
                                description: "الدفع عبر PayPal",
                                icon: Wallet,
                              },
                              moyasar: {
                                label: "Moyasar",
                                description: "الدفع عبر بوابة Moyasar",
                                icon: CreditCard,
                              },
                              hyperpay: {
                                label: "HyperPay",
                                description: "الدفع عبر HyperPay",
                                icon: CreditCard,
                              },
                              bank_transfer: {
                                label: "تحويل بنكي",
                                description: "الدفع عن طريق التحويل البنكي",
                                icon: Building2,
                              },
                            };

                            const config = gatewayConfig[method.gateway_type as keyof typeof gatewayConfig];
                            if (!config) return null;

                            const Icon = config.icon;

                            return (
                              <div
                                key={method.id}
                                className="flex items-center space-x-2 space-x-reverse border-2 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                              >
                                <RadioGroupItem value={method.gateway_type} id={method.gateway_type} />
                                <Label
                                  htmlFor={method.gateway_type}
                                  className="flex items-center gap-3 cursor-pointer flex-1"
                                >
                                  <Icon className="w-5 h-5 text-primary" />
                                  <div>
                                    <div className="font-bold">{config.label}</div>
                                    <div className="text-sm text-charcoal-light">{config.description}</div>
                                    {method.is_test_mode && (
                                      <div className="text-xs text-amber-600 mt-1">وضع التجربة</div>
                                    )}
                                  </div>
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </RadioGroup>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-2 sticky top-24 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-charcoal mb-6">
                      ملخص الطلب
                    </h3>
                    
                    {/* Promo Code Section */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-charcoal">كود الخصم</span>
                      </div>
                      {!appliedPromo ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="أدخل كود الخصم"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="flex-1"
                          />
                          <Button 
                            type="button"
                            onClick={applyPromoCode}
                            disabled={checkingPromo}
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            {checkingPromo ? "جاري التحقق..." : "تطبيق"}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-bold text-green-700">
                              {appliedPromo.code}
                            </span>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={removePromoCode}
                            className="text-red-500 hover:text-red-600"
                          >
                            إزالة
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 pb-4 border-b">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-sm">{item.name}</p>
                            <p className="text-charcoal-light text-sm">
                              الكمية: {item.quantity}
                            </p>
                            <p className="text-primary font-bold">
                              {item.price * item.quantity} ر.س
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-charcoal-light">
                        <span>المجموع الفرعي</span>
                        <span>{totalPrice} ر.س</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between text-green-600 font-bold">
                          <span>الخصم</span>
                          <span>- {discount.toFixed(2)} ر.س</span>
                        </div>
                      )}
                      <div className="flex justify-between text-charcoal-light">
                        <span>الشحن</span>
                        <span className="text-green-600 font-bold">مجاني</span>
                      </div>
                      <div className="border-t-2 pt-3">
                        <div className="flex justify-between text-2xl font-black">
                          <span className="text-charcoal">الإجمالي</span>
                          <span className="text-primary">{finalTotal.toFixed(2)} ر.س</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow text-lg py-6"
                      disabled={submitting}
                    >
                      {submitting ? "جاري الإرسال..." : "تأكيد الطلب"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
