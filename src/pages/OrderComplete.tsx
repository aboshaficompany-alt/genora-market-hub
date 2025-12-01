import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";  
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, MapPin, CreditCard, Calendar, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function OrderComplete() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (orderId) {
      loadOrderData();
    } else {
      navigate("/");
    }
  }, [user, authLoading, orderId]);

  const loadOrderData = async () => {
    if (!orderId) return;

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      setOrder(orderData);
      setOrderItems(itemsData || []);
    } catch (error) {
      console.error("Error loading order:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) {
    return null;
  }

  const gatewayLabels: Record<string, string> = {
    stripe: "Stripe",
    tap: "Tap Payments",
    paypal: "PayPal",
    moyasar: "Moyasar",
    hyperpay: "HyperPay",
    bank_transfer: "تحويل بنكي",
    credit_card: "بطاقة ائتمان",
    cash_on_delivery: "الدفع عند الاستلام",
  };

  const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغي",
  };

  const paymentStatusLabels: Record<string, string> = {
    pending: "قيد المعالجة",
    completed: "مكتمل",
    failed: "فشل",
  };

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Icon */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-6 shadow-elegant animate-pulse">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-black text-charcoal mb-4">
              تم تأكيد <span className="bg-gradient-primary bg-clip-text text-transparent">طلبك</span>!
            </h1>
            <p className="text-xl text-charcoal-light">
              شكراً لك! تم استلام طلبك وسيتم معالجته قريباً
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6 border-4 border-primary shadow-glow animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6">
              <div className="bg-gradient-primary text-primary-foreground p-4 -m-6 mb-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">تفاصيل الطلب</h2>
                  <div className="text-sm">
                    رقم الطلب: <span className="font-bold">#{order.id.substring(0, 8)}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-secondary/50 p-4 rounded-lg border-2 border-yellow-warm">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="text-sm text-muted-foreground">تاريخ الطلب</div>
                      <div className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-secondary/50 p-4 rounded-lg border-2 border-yellow-warm">
                    <Package className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="text-sm text-muted-foreground">حالة الطلب</div>
                      <div className="font-semibold">{statusLabels[order.status] || order.status}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-secondary/50 p-4 rounded-lg border-2 border-yellow-warm">
                    <CreditCard className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="text-sm text-muted-foreground">طريقة الدفع</div>
                      <div className="font-semibold">
                        {gatewayLabels[order.payment_gateway] || order.payment_gateway}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        الحالة: {paymentStatusLabels[order.payment_status] || order.payment_status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-secondary/50 p-4 rounded-lg border-2 border-yellow-light">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      معلومات الشحن
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>الاسم:</strong> {order.shipping_name}</p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {order.shipping_email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {order.shipping_phone}
                      </p>
                      <p><strong>المدينة:</strong> {order.shipping_city}</p>
                      <p><strong>العنوان:</strong> {order.shipping_address}</p>
                      {order.notes && (
                        <p><strong>ملاحظات:</strong> {order.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-lg mb-4">المنتجات</h3>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                      <div>
                        <div className="font-semibold">{item.product_name}</div>
                        <div className="text-sm text-muted-foreground">
                          الكمية: {item.quantity} × {item.product_price.toFixed(2)} ر.س
                        </div>
                      </div>
                      <div className="font-bold">{item.subtotal.toFixed(2)} ر.س</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-primary text-primary-foreground p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">المجموع الكلي</span>
                    <span className="text-3xl font-black">{order.total_amount.toFixed(2)} ر.س</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Link to="/orders">
              <Button size="lg" className="w-full bg-gradient-primary">
                عرض جميع طلباتي
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="w-full">
                العودة للرئيسية
              </Button>
            </Link>
          </div>

          {/* Support Section */}
          <Card className="border-3 border-pink-accent animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-2xl font-bold mb-2">هل تحتاج مساعدة؟</h3>
              <p className="text-muted-foreground mb-4">
                فريق الدعم جاهز لمساعدتك في أي وقت
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/messages">
                  <Button className="bg-gradient-primary">
                    تواصل معنا
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {isMobile ? <MobileFooter /> : <Footer />}
    </div>
  );
}
