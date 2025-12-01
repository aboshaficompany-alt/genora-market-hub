import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

interface PaymentStats {
  gateway: string;
  total_amount: number;
  total_orders: number;
  successful_payments: number;
  pending_payments: number;
}

export default function PaymentReports() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isVendor, setIsVendor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [stats, setStats] = useState<PaymentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    checkAccess();
  }, [user, authLoading]);

  const checkAccess = async () => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    const vendorStatus = await hasRole("vendor");
    const adminStatus = await hasRole("admin");
    
    setIsVendor(vendorStatus);
    setIsAdmin(adminStatus);

    if (!vendorStatus && !adminStatus) {
      navigate("/");
      return;
    }

    if (vendorStatus) {
      const { data: storeData } = await supabase
        .from("stores")
        .select("*")
        .eq("vendor_id", user.id)
        .maybeSingle();
      setStore(storeData);
    }

    loadPaymentStats();
  };

  const loadPaymentStats = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (store) params.p_store_id = store.id;
      if (startDate) params.p_start_date = new Date(startDate).toISOString();
      if (endDate) params.p_end_date = new Date(endDate).toISOString();

      const { data, error } = await supabase.rpc(
        "calculate_payment_gateway_stats",
        params
      );

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error("Error loading payment stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = stats.reduce((sum, stat) => sum + Number(stat.total_amount), 0);
  const totalOrders = stats.reduce((sum, stat) => sum + Number(stat.total_orders), 0);
  const totalSuccessful = stats.reduce((sum, stat) => sum + Number(stat.successful_payments), 0);
  const totalPending = stats.reduce((sum, stat) => sum + Number(stat.pending_payments), 0);

  const gatewayColors: Record<string, string> = {
    stripe: "hsl(var(--primary))",
    tap: "hsl(var(--secondary))",
    paypal: "hsl(var(--accent))",
    moyasar: "hsl(var(--chart-1))",
    hyperpay: "hsl(var(--chart-2))",
    bank_transfer: "hsl(var(--chart-3))",
    credit_card: "hsl(var(--chart-4))",
    cash_on_delivery: "hsl(var(--chart-5))",
  };

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

  const pieData = stats.map((stat) => ({
    name: gatewayLabels[stat.gateway] || stat.gateway,
    value: Number(stat.total_amount),
    fill: gatewayColors[stat.gateway] || "hsl(var(--muted))",
  }));

  const barData = stats.map((stat) => ({
    gateway: gatewayLabels[stat.gateway] || stat.gateway,
    revenue: Number(stat.total_amount),
    orders: Number(stat.total_orders),
  }));

  const Sidebar = isAdmin ? AdminSidebar : VendorSidebar;

  if (authLoading || (!isVendor && !isAdmin)) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full" dir="rtl">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        
        <div className="flex flex-1 w-full">
          <Sidebar />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                تقارير الدفعات
              </h1>
              <p className="text-muted-foreground">
                تقارير مفصلة عن المبالغ المحصلة من كل بوابة دفع
              </p>
            </div>

            {/* Date Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  تصفية حسب التاريخ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="start-date">من تاريخ</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">إلى تاريخ</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={loadPaymentStats} className="w-full">
                      تحديث التقرير
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="gradient-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} ر.س</div>
                </CardContent>
              </Card>

              <Card className="gradient-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                </CardContent>
              </Card>

              <Card className="gradient-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">دفعات مكتملة</CardTitle>
                  <CreditCard className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSuccessful}</div>
                </CardContent>
              </Card>

              <Card className="gradient-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">دفعات معلقة</CardTitle>
                  <CreditCard className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPending}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="pie" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pie">التوزيع حسب البوابة</TabsTrigger>
                <TabsTrigger value="bar">الإيرادات والطلبات</TabsTrigger>
                <TabsTrigger value="table">الجدول التفصيلي</TabsTrigger>
              </TabsList>

              <TabsContent value="pie">
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع الإيرادات حسب بوابة الدفع</CardTitle>
                    <CardDescription>نسبة الإيرادات من كل بوابة دفع</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={120}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `${Number(value).toFixed(2)} ر.س`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bar">
                <Card>
                  <CardHeader>
                    <CardTitle>الإيرادات والطلبات حسب البوابة</CardTitle>
                    <CardDescription>مقارنة الإيرادات وعدد الطلبات لكل بوابة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="gateway" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="left" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="الإيرادات (ر.س)" />
                        <Bar yAxisId="right" dataKey="orders" fill="hsl(var(--secondary))" name="عدد الطلبات" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="table">
                <Card>
                  <CardHeader>
                    <CardTitle>الجدول التفصيلي</CardTitle>
                    <CardDescription>تفاصيل جميع بوابات الدفع</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right p-4">بوابة الدفع</th>
                            <th className="text-right p-4">إجمالي الإيرادات</th>
                            <th className="text-right p-4">عدد الطلبات</th>
                            <th className="text-right p-4">دفعات مكتملة</th>
                            <th className="text-right p-4">دفعات معلقة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.map((stat) => (
                            <tr key={stat.gateway} className="border-b hover:bg-muted/50">
                              <td className="p-4 font-medium">
                                {gatewayLabels[stat.gateway] || stat.gateway}
                              </td>
                              <td className="p-4">{Number(stat.total_amount).toFixed(2)} ر.س</td>
                              <td className="p-4">{stat.total_orders}</td>
                              <td className="p-4 text-green-600">{stat.successful_payments}</td>
                              <td className="p-4 text-orange-600">{stat.pending_payments}</td>
                            </tr>
                          ))}
                          {stats.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                لا توجد بيانات للعرض
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
}
