import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Package, TrendingUp, XCircle, Clock, CheckCircle } from "lucide-react";

interface ProductStats {
  totalProducts: number;
  approvedProducts: number;
  pendingProducts: number;
  rejectedProducts: number;
  topSellingProducts: any[];
  rejectedProductsList: any[];
  categoryDistribution: any[];
  approvalTrend: any[];
}

export default function ProductsStats() {
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    approvedProducts: 0,
    pendingProducts: 0,
    rejectedProducts: 0,
    topSellingProducts: [],
    rejectedProductsList: [],
    categoryDistribution: [],
    approvalTrend: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    // تحميل جميع المنتجات
    const { data: products } = await supabase
      .from("products")
      .select(`
        *,
        stores (name)
      `)
      .order("created_at", { ascending: false });

    if (!products) {
      setLoading(false);
      return;
    }

    // حساب الإحصائيات الأساسية
    const totalProducts = products.length;
    const approvedProducts = products.filter(p => p.approval_status === 'approved').length;
    const pendingProducts = products.filter(p => p.approval_status === 'pending').length;
    const rejectedProducts = products.filter(p => p.approval_status === 'rejected').length;

    // أعلى المنتجات مبيعاً (حسب عدد الطلبات)
    const { data: orderItems } = await supabase
      .from("order_items")
      .select(`
        product_id,
        quantity,
        products (name, price, image_url, stores (name))
      `);

    const productSales = orderItems?.reduce((acc: any, item: any) => {
      const productId = item.product_id;
      if (!acc[productId]) {
        acc[productId] = {
          id: productId,
          name: item.products?.name || 'منتج محذوف',
          storeName: item.products?.stores?.name || 'متجر غير معروف',
          price: item.products?.price || 0,
          image_url: item.products?.image_url,
          totalSold: 0,
          revenue: 0,
        };
      }
      acc[productId].totalSold += item.quantity;
      acc[productId].revenue += item.quantity * (item.products?.price || 0);
      return acc;
    }, {});

    const topSellingProducts = Object.values(productSales || {})
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 10);

    // المنتجات المرفوضة
    const rejectedProductsList = products
      .filter(p => p.approval_status === 'rejected')
      .map(p => ({
        id: p.id,
        name: p.name,
        storeName: p.stores?.name || 'متجر غير معروف',
        rejectionReason: p.rejection_reason,
        createdAt: p.created_at,
      }));

    // توزيع المنتجات حسب الفئة
    const categoryCounts = products.reduce((acc: any, product) => {
      const category = product.category || "غير محدد";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // اتجاه الموافقة (آخر 30 يوم)
    const last30Days = products.filter((product) => {
      const productDate = new Date(product.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return productDate >= thirtyDaysAgo;
    });

    const approvalByDay = last30Days.reduce((acc: any, product) => {
      const day = new Date(product.created_at).toLocaleDateString("ar-SA", {
        day: "numeric",
        month: "short",
      });
      if (!acc[day]) {
        acc[day] = { day, approved: 0, rejected: 0, pending: 0 };
      }
      if (product.approval_status === 'approved') acc[day].approved++;
      if (product.approval_status === 'rejected') acc[day].rejected++;
      if (product.approval_status === 'pending') acc[day].pending++;
      return acc;
    }, {});

    const approvalTrend = Object.values(approvalByDay);

    setStats({
      totalProducts,
      approvedProducts,
      pendingProducts,
      rejectedProducts,
      topSellingProducts,
      rejectedProductsList,
      categoryDistribution,
      approvalTrend,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>جاري تحميل الإحصائيات...</p>
      </div>
    );
  }

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--muted))',
  ];

  return (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">منتجات موافق عليها</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedProducts}</div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">منتجات قيد المراجعة</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingProducts}</div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">منتجات مرفوضة</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gradient-border">
          <CardHeader>
            <CardTitle>المنتجات حسب الفئة</CardTitle>
            <CardDescription>توزيع المنتجات على الفئات المختلفة</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
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
                  {stats.categoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardHeader>
            <CardTitle>اتجاه الموافقة (آخر 30 يوم)</CardTitle>
            <CardDescription>حالة المنتجات المضافة حديثاً</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.approvalTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="hsl(var(--primary))" name="موافق عليها" />
                <Bar dataKey="pending" fill="#f59e0b" name="قيد المراجعة" />
                <Bar dataKey="rejected" fill="#ef4444" name="مرفوضة" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* المنتجات الأكثر مبيعاً */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            المنتجات الأكثر مبيعاً
          </CardTitle>
          <CardDescription>أفضل 10 منتجات من حيث المبيعات</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topSellingProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.topSellingProducts.map((product: any, index: number) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <span className="font-bold text-primary">#{index + 1}</span>
                  </div>
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.storeName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{product.totalSold} وحدة</p>
                    <p className="text-sm text-muted-foreground">{product.revenue.toFixed(2)} ر.س</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">لا توجد بيانات مبيعات بعد</p>
          )}
        </CardContent>
      </Card>

      {/* المنتجات المرفوضة */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            المنتجات المرفوضة
          </CardTitle>
          <CardDescription>قائمة بالمنتجات التي تم رفضها وأسباب الرفض</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.rejectedProductsList.length > 0 ? (
            <div className="space-y-3">
              {stats.rejectedProductsList.map((product: any) => (
                <div key={product.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.storeName}</p>
                    </div>
                    <Badge variant="destructive">مرفوض</Badge>
                  </div>
                  {product.rejectionReason && (
                    <div className="mt-2 p-2 bg-white rounded text-sm">
                      <span className="font-medium">سبب الرفض: </span>
                      {product.rejectionReason}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    تاريخ الإضافة: {new Date(product.createdAt).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">لا توجد منتجات مرفوضة</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
