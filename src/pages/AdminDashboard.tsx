import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Users,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [stats, setStats] = useState({
    totalStores: 0,
    pendingStores: 0,
    totalUsers: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!authLoading && user) {
        const adminStatus = await hasRole("admin");
        setIsAdmin(adminStatus);

        if (!adminStatus) {
          toast({
            variant: "destructive",
            title: "غير مصرح",
            description: "هذه الصفحة متاحة للمدراء فقط",
          });
          navigate("/");
        } else {
          loadAdminData();
        }
      } else if (!authLoading && !user) {
        navigate("/auth");
      }
    };

    checkAdminStatus();
  }, [user, authLoading, navigate]);

  const loadAdminData = async () => {
    // تحميل المتاجر
    const { data: storesData } = await supabase
      .from("stores")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    setStores(storesData || []);

    // تحميل المستخدمين
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(usersData || []);

    // تحميل الطلبات
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    setOrders(ordersData || []);

    // حساب الإحصائيات
    const pendingStores = storesData?.filter((s) => !s.is_approved).length || 0;
    setStats({
      totalStores: storesData?.length || 0,
      pendingStores,
      totalUsers: usersData?.length || 0,
      totalOrders: ordersData?.length || 0,
    });
  };

  const handleApproveStore = async (storeId: string) => {
    const { error } = await supabase
      .from("stores")
      .update({ is_approved: true, verified: true })
      .eq("id", storeId);

    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل الموافقة على المتجر",
      });
    } else {
      toast({
        title: "نجاح",
        description: "تمت الموافقة على المتجر بنجاح",
      });
      loadAdminData();
    }
  };

  const handleRejectStore = async (storeId: string) => {
    const { error } = await supabase
      .from("stores")
      .delete()
      .eq("id", storeId);

    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل رفض المتجر",
      });
    } else {
      toast({
        title: "نجاح",
        description: "تم رفض المتجر بنجاح",
      });
      loadAdminData();
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            لوحة تحكم المدير
          </h1>
          <p className="text-muted-foreground">
            إدارة المتاجر والمستخدمين والطلبات
          </p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المتاجر
              </CardTitle>
              <Store className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStores}</div>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                متاجر قيد المراجعة
              </CardTitle>
              <Store className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingStores}</div>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المستخدمين
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الطلبات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="stores" className="space-y-4">
          <TabsList>
            <TabsTrigger value="stores">المتاجر</TabsTrigger>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-4">
            <h2 className="text-2xl font-bold">إدارة المتاجر</h2>
            <div className="space-y-4">
              {stores.map((store) => (
                <Card key={store.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{store.name}</h3>
                          {store.is_approved ? (
                            <Badge className="bg-green-500">موافق عليه</Badge>
                          ) : (
                            <Badge className="bg-orange-500">قيد المراجعة</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {store.description}
                        </p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>المالك: {store.owner_name}</p>
                          <p>المدينة: {store.city}</p>
                          <p>الهاتف: {store.phone}</p>
                          <p>القسم: {store.category}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStore(store)}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                        {!store.is_approved && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApproveStore(store.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="h-4 w-4 ml-1" />
                              موافقة
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRejectStore(store.id)}
                            >
                              <XCircle className="h-4 w-4 ml-1" />
                              رفض
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <h2 className="text-2xl font-bold mb-4">المستخدمين</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{user.full_name || "بدون اسم"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <h2 className="text-2xl font-bold mb-4">الطلبات</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">
                          طلب من: {order.profiles?.full_name || order.shipping_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          الإجمالي: {order.total_amount} ر.س
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                      <Badge>{order.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog لعرض تفاصيل المتجر */}
      <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل المتجر</DialogTitle>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-4">
              {selectedStore.image_url && (
                <img
                  src={selectedStore.image_url}
                  alt={selectedStore.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">اسم المتجر:</p>
                  <p className="text-sm">{selectedStore.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">القسم:</p>
                  <p className="text-sm">{selectedStore.category}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">المالك:</p>
                  <p className="text-sm">{selectedStore.owner_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">رقم الهوية:</p>
                  <p className="text-sm">{selectedStore.owner_id_number}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">المدينة:</p>
                  <p className="text-sm">{selectedStore.city}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">الهاتف:</p>
                  <p className="text-sm">{selectedStore.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold">البريد الإلكتروني:</p>
                  <p className="text-sm">{selectedStore.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold">الوصف:</p>
                  <p className="text-sm">{selectedStore.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
