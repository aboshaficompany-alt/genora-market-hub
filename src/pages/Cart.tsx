import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);

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

      // Check if promo code is still valid
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-warm" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-4 py-32">
          <div className="text-center animate-fade-in">
            <ShoppingBag className="w-24 h-24 mx-auto text-charcoal-light mb-6" />
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              السلة فارغة
            </h2>
            <p className="text-charcoal-light mb-8">
              لم تقم بإضافة أي منتجات إلى السلة بعد
            </p>
            <Link to="/products">
              <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow">
                تصفح المنتجات
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black text-charcoal mb-12 text-center animate-fade-in">
            سلة <span className="bg-gradient-primary bg-clip-text text-transparent">التسوق</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden border-2 hover:border-primary transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-lg hover:scale-105 transition-transform"
                        />
                      </Link>
                      
                      <div className="flex-1">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-xl font-bold text-charcoal mb-2 hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-charcoal-light mb-4">{item.storeName}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-black text-primary">
                            {item.price * item.quantity} ر.س
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border-2 border-border rounded-full p-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 rounded-full"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-bold">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 rounded-full"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="border-2 sticky top-24 animate-fade-in">
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
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-charcoal-light">
                      <span>عدد المنتجات</span>
                      <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
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
                      <span>مجاني</span>
                    </div>
                    <div className="border-t-2 pt-4">
                      <div className="flex justify-between text-2xl font-black">
                        <span className="text-charcoal">الإجمالي</span>
                        <span className="text-primary">{finalTotal.toFixed(2)} ر.س</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/checkout">
                    <Button className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow text-lg py-6">
                      إتمام الطلب
                    </Button>
                  </Link>
                  
                  <Link to="/products">
                    <Button variant="outline" className="w-full mt-3">
                      متابعة التسوق
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
