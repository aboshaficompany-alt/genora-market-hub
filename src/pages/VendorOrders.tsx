import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileFooter from "@/components/MobileFooter";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Calendar, MapPin, Phone, Mail } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_email: string;
  notes: string | null;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  product_price: number;
  subtotal: number;
  product_id: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "قيد الانتظار", color: "bg-yellow-500" },
  { value: "confirmed", label: "مؤكد", color: "bg-blue-500" },
  { value: "shipped", label: "تم الشحن", color: "bg-purple-500" },
  { value: "delivered", label: "تم التسليم", color: "bg-green-500" },
  { value: "cancelled", label: "ملغي", color: "bg-red-500" },
];

export default function VendorOrders() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isVendor, setIsVendor] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const checkVendorStatus = async () => {
      if (!authLoading && user) {
        const vendorStatus = await hasRole("vendor");
        setIsVendor(vendorStatus);

        if (!vendorStatus) {
          toast({
            variant: "destructive",
            title: "غير مصرح",
            description: "هذه الصفحة متاحة للتجار فقط",
          });
          navigate("/");
        } else {
          loadOrders();
        }
      } else if (!authLoading && !user) {
        navigate("/auth");
      }
    };

    checkVendorStatus();
  }, [user, authLoading, navigate]);

  const loadOrders = async () => {
    try {
      // جلب معرف المتجر الخاص بالتاجر
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("vendor_id", user?.id)
        .single();

      if (storeError || !storeData) {
        throw new Error("لم يتم العثور على متجر");
      }

      setStoreId(storeData.id);

      // جلب الطلبات المتعلقة بمنتجات المتجر
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (
              store_id
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // تصفية الطلبات التي تحتوي على منتجات من متجر التاجر
      const vendorOrders = ordersData
        ?.map((order) => ({
          ...order,
          order_items: order.order_items.filter(
            (item: any) => item.products?.store_id === storeData.id
          ),
        }))
        .filter((order) => order.order_items.length > 0);

      setOrders(vendorOrders || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "فشل تحميل الطلبات",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus as "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" })
      .eq("id", orderId);

    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحديث حالة الطلب",
      });
    } else {
      toast({
        title: "نجاح",
        description: "تم تحديث حالة الطلب بنجاح",
      });
      loadOrders();
    }
  };

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return (
      <Badge className={option?.color || "bg-gray-500"}>
        {option?.label || status}
      </Badge>
    );
  };

  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  if (authLoading || !isVendor || loading) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full" dir="rtl">
        {isMobile ? <MobileNavbar /> : <Navbar />}

        <div className="flex flex-1 w-full">
          <VendorSidebar />

          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />

            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                إدارة الطلبات
              </h1>
              <p className="text-muted-foreground">
                عرض وإدارة الطلبات المتعلقة بمنتجاتك
              </p>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">لا توجد طلبات</h3>
                  <p className="text-muted-foreground">
                    لم تتلق أي طلبات بعد
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">
                            طلب #{order.id.slice(0, 8)}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.created_at).toLocaleDateString("ar-SA")}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {getStatusBadge(order.status)}
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="تحديث الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* معلومات الشحن */}
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold mb-3">معلومات الشحن</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">الاسم:</span>
                            <span>{order.shipping_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="font-medium">الهاتف:</span>
                            <span>{order.shipping_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            <span className="font-medium">البريد:</span>
                            <span>{order.shipping_email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">المدينة:</span>
                            <span>{order.shipping_city}</span>
                          </div>
                          <div className="md:col-span-2 flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-primary mt-1" />
                            <span className="font-medium">العنوان:</span>
                            <span>{order.shipping_address}</span>
                          </div>
                          {order.notes && (
                            <div className="md:col-span-2 flex items-start gap-2">
                              <Package className="h-4 w-4 text-primary mt-1" />
                              <span className="font-medium">ملاحظات:</span>
                              <span>{order.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* المنتجات */}
                      <div>
                        <h4 className="font-semibold mb-3">المنتجات</h4>
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-3 bg-muted/30 rounded"
                            >
                              <div>
                                <p className="font-medium">{item.product_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  الكمية: {item.quantity} × {item.product_price} ر.س
                                </p>
                              </div>
                              <p className="font-bold">{item.subtotal} ر.س</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* المجموع */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-lg font-bold">المجموع الكلي:</span>
                        <span className="text-2xl font-bold text-primary">
                          {calculateOrderTotal(order.order_items)} ر.س
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>

        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
}
