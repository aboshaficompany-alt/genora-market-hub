import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export default function OrderHistory() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      loadOrders();
    }
  }, [user, authLoading, navigate]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      cancelled: "ملغي",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500",
      confirmed: "bg-blue-500/10 text-blue-500",
      shipped: "bg-purple-500/10 text-purple-500",
      delivered: "bg-green-500/10 text-green-500",
      cancelled: "bg-red-500/10 text-red-500",
    };
    return colorMap[status] || "bg-gray-500/10 text-gray-500";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            سجل الطلبات
          </h1>
          <p className="text-muted-foreground">
            تابع جميع طلباتك السابقة والحالية
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <Package className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-bold">لا توجد طلبات بعد</h3>
              <p className="text-muted-foreground">
                ابدأ التسوق الآن لإضافة أول طلب لك
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden gradient-border">
                <div className="bg-gradient-subtle p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">رقم الطلب</p>
                      <p className="font-mono text-sm">{order.id.slice(0, 8)}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        {item.product?.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product_name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            الكمية: {item.quantity} × {item.product_price} ر.س
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold">{item.subtotal} ر.س</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">المجموع الكلي</span>
                      <span className="text-2xl font-bold text-primary">
                        {order.total_amount} ر.س
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h5 className="font-semibold mb-2">عنوان التوصيل</h5>
                    <p className="text-sm">
                      {order.shipping_name}<br />
                      {order.shipping_address}<br />
                      {order.shipping_city}<br />
                      {order.shipping_phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
