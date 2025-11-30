import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsStats from "./ProductsStats";

export default function AdminDashboard() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [editCategoryDialog, setEditCategoryDialog] = useState(false);
  const [selectedStoreCategory, setSelectedStoreCategory] = useState("");
  const [stats, setStats] = useState({
    totalStores: 0,
    pendingStores: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState<any>({
    categoriesData: [],
    ordersData: [],
    revenueData: [],
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
    // تحميل الفئات
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    
    setCategories(categoriesData || []);

    const { data: storesData } = await supabase
      .from("stores")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    setStores(storesData || []);

    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(usersData || []);

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    setOrders(ordersData || []);

    const pendingStores = storesData?.filter((s) => !s.is_approved).length || 0;
    const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    
    setStats({
      totalStores: storesData?.length || 0,
      pendingStores,
      totalUsers: usersData?.length || 0,
      totalOrders: ordersData?.length || 0,
      totalRevenue,
    });

    prepareChartData(storesData, ordersData);
  };

  const prepareChartData = (storesData: any[], ordersData: any[]) => {
    const categoryCounts = storesData?.reduce((acc: any, store) => {
      const category = store.category || "غير محدد";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoriesData = Object.entries(categoryCounts || {}).map(([name, value]) => ({
      name,
      value,
    }));

    const statusCounts = ordersData?.reduce((acc: any, order) => {
      const status = order.status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const ordersData_chart = Object.entries(statusCounts || {}).map(([name, value]) => ({
      name: name === "pending" ? "قيد الانتظار" : 
            name === "confirmed" ? "مؤكد" :
            name === "shipped" ? "تم الشحن" :
            name === "delivered" ? "تم التسليم" : "ملغي",
      value,
    }));

    const last6Months = ordersData
      ?.filter((order) => {
        const orderDate = new Date(order.created_at);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return orderDate >= sixMonthsAgo;
      })
      .reduce((acc: any, order) => {
        const month = new Date(order.created_at).toLocaleDateString("ar-SA", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + (order.total_amount || 0);
        return acc;
      }, {});

    const revenueData = Object.entries(last6Months || {}).map(([name, value]) => ({
      name,
      value,
    }));

    setChartData({
      categoriesData,
      ordersData: ordersData_chart,
      revenueData,
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

  const handleEditCategory = (store: any) => {
    setSelectedStore(store);
    setSelectedStoreCategory(store.category || "مأكولات ومشروبات");
    setEditCategoryDialog(true);
  };

  const handleUpdateCategory = async () => {
    if (!selectedStore) return;

    const { error } = await supabase
      .from("stores")
      .update({ category: selectedStoreCategory })
      .eq("id", selectedStore.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحديث فئة المتجر",
      });
    } else {
      toast({
        title: "نجاح",
        description: "تم تحديث فئة المتجر بنجاح",
      });
      setEditCategoryDialog(false);
      loadAdminData();
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

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
                لوحة تحكم المدير
              </h1>
              <p className="text-muted-foreground">
                إدارة المتاجر والمستخدمين والطلبات
              </p>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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

              <Card className="gradient-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي الإيرادات
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} ر.س</div>
                </CardContent>
              </Card>
            </div>

            {/* الرسوم البيانية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>المتاجر حسب الفئة</CardTitle>
                  <CardDescription>توزيع المتاجر على الفئات المختلفة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.categoriesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {chartData.categoriesData.map((_: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "hsl(var(--primary))"
                                : index === 1
                                ? "hsl(var(--secondary))"
                                : index === 2
                                ? "hsl(var(--accent))"
                                : "hsl(var(--muted))"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>الطلبات حسب الحالة</CardTitle>
                  <CardDescription>توزيع الطلبات على الحالات المختلفة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.ordersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="gradient-border lg:col-span-2">
                <CardHeader>
                  <CardTitle>الإيرادات الشهرية</CardTitle>
                  <CardDescription>إيرادات آخر 6 أشهر</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="الإيرادات (ر.س)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* التبويبات */}
            <Tabs defaultValue="stats" className="space-y-4">
              <TabsList>
                <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
                <TabsTrigger value="products">إحصائيات المنتجات</TabsTrigger>
                <TabsTrigger value="stores">المتاجر</TabsTrigger>
                <TabsTrigger value="users">المستخدمين</TabsTrigger>
                <TabsTrigger value="orders">الطلبات</TabsTrigger>
              </TabsList>

              <TabsContent value="stats">
                {/* الرسوم البيانية الأساسية */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="gradient-border">
                    <CardHeader>
                      <CardTitle>المتاجر حسب الفئة</CardTitle>
                      <CardDescription>توزيع المتاجر على الفئات المختلفة</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData.categoriesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="hsl(var(--primary))"
                            dataKey="value"
                          >
                            {chartData.categoriesData.map((_: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  index === 0
                                    ? "hsl(var(--primary))"
                                    : index === 1
                                    ? "hsl(var(--secondary))"
                                    : index === 2
                                    ? "hsl(var(--accent))"
                                    : "hsl(var(--muted))"
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="gradient-border">
                    <CardHeader>
                      <CardTitle>الطلبات حسب الحالة</CardTitle>
                      <CardDescription>توزيع الطلبات على الحالات المختلفة</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.ordersData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="gradient-border lg:col-span-2">
                    <CardHeader>
                      <CardTitle>الإيرادات الشهرية</CardTitle>
                      <CardDescription>إيرادات آخر 6 أشهر</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData.revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            name="الإيرادات (ر.س)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <ProductsStats />
              </TabsContent>

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
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEditCategory(store)}
                            >
                              تغيير الفئة
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
        </div>

        <Footer />
      </div>
      
      {/* Store Details Dialog */}
      <Dialog open={!!selectedStore && !editCategoryDialog} onOpenChange={() => setSelectedStore(null)}>
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

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryDialog} onOpenChange={setEditCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغيير فئة المتجر</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>اسم المتجر</Label>
              <p className="text-sm font-medium">{selectedStore?.name}</p>
            </div>
            <div className="space-y-2">
              <Label>الفئة الجديدة</Label>
              <Select value={selectedStoreCategory} onValueChange={setSelectedStoreCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name_ar}>
                      {category.icon} {category.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategoryDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateCategory}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
