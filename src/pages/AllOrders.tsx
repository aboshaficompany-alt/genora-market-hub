import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ShoppingCart } from "lucide-react";

export default function AllOrders() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (authLoading) return;
      if (!user) {
        navigate("/auth");
        return;
      }
      const isAdmin = await hasRole("admin");
      if (!isAdmin) {
        navigate("/");
        return;
      }
      loadOrders();
    };
    checkAdmin();
  }, [user, authLoading]);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      pending: { label: "قيد الانتظار", variant: "secondary" },
      confirmed: { label: "مؤكد", variant: "default" },
      shipped: { label: "تم الشحن", variant: "default" },
      delivered: { label: "تم التسليم", variant: "default" },
      cancelled: { label: "ملغي", variant: "destructive" },
    };
    const s = statusMap[status] || statusMap.pending;
    return <Badge variant={s.variant as any}>{s.label}</Badge>;
  };

  if (authLoading) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                جميع الطلبات
              </h1>
              <p className="text-muted-foreground">عرض وإدارة جميع الطلبات في المنصة</p>
            </div>

            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">العميل: {order.profiles?.full_name || order.shipping_name}</p>
                        <p className="text-sm text-muted-foreground">المبلغ: {order.total_amount} ر.س</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
