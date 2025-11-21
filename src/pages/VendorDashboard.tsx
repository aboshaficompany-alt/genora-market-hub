import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Plus, Package, ShoppingCart, TrendingUp, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function VendorDashboard() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isVendor, setIsVendor] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    const checkVendorStatus = async () => {
      if (authLoading) return;

      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const vendorStatus = await hasRole("vendor");
        setIsVendor(vendorStatus);

        if (!vendorStatus) {
          toast({
            variant: "destructive",
            title: "غير مصرح",
            description: "هذه الصفحة متاحة للتجار فقط",
          });
          navigate("/");
          return;
        }

        loadVendorData();
      } catch (error) {
        console.error("Error checking vendor status:", error);
        navigate("/");
      }
    };

    checkVendorStatus();
  }, [user, authLoading]);

  const loadVendorData = async () => {
    if (!user) return;

    // Load store
    const { data: storeData } = await supabase.from("stores").select("*").eq("vendor_id", user.id).maybeSingle();

    setStore(storeData);

    if (storeData) {
      // Load products
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeData.id)
        .order("created_at", { ascending: false });

      setProducts(productsData || []);

      // Load orders based on product IDs
      const productIds = productsData?.map((p) => p.id) || [];

      let ordersData = [];
      if (productIds.length > 0) {
        const { data, error } = await supabase
          .from("order_items")
          .select(
            `
            *,
            order:orders(*),
            product:products(*)
          `,
          )
          .in("product_id", productIds);

        if (error) console.error(error);
        ordersData = data || [];
      }

      setOrders(ordersData);

      // Stats
      const totalRevenue = ordersData.reduce(
        (sum, item) => sum + (typeof item.subtotal === "string" ? parseFloat(item.subtotal) : item.subtotal),
        0,
      );

      setStats({
        totalProducts: productsData?.length || 0,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
      });
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!store) return;

    setIsAddingProduct(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from("products").insert({
      store_id: store.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      discount_price: formData.get("discount_price") ? parseFloat(formData.get("discount_price") as string) : null,
      image_url: formData.get("image_url") as string,
      category: formData.get("category") as string,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل إضافة المنتج",
      });
    } else {
      toast({
        title: "نجاح",
        description: "تم إضافة المنتج بنجاح",
      });
      loadVendorData();
    }

    setIsAddingProduct(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل حذف المنتج",
      });
    } else {
      toast({
        title: "نجاح",
        description: "تم حذف المنتج بنجاح",
      });
      loadVendorData();
    }
  };

  if (authLoading || !isVendor) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                لوحة تحكم التاجر
              </h1>
              <p className="text-muted-foreground">إدارة متجرك ومنتجاتك وطلباتك</p>
            </div>

            {store && (
              <Link to="/store-settings">
                <Button variant="outline" className="font-bold">
                  <Settings className="ml-2 h-4 w-4" />
                  إعدادات المتجر
                </Button>
              </Link>
            )}
          </div>

          {!store && (
            <Card className="mt-4 border-orange-500">
              <CardContent className="p-6">
                <p className="text-center">ليس لديك متجر مسجل بعد. يرجى تسجيل متجرك أولاً.</p>
                <div className="flex gap-4 mt-4">
                  <Link to="/vendor-registration" className="flex-1">
                    <Button className="w-full bg-gradient-primary">سجل متجرك الآن</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Store Info */}
        {store && (
          <Card className="mb-8 gradient-border">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">رابط المتجر</p>
                  <p className="font-semibold">{store.store_url || "لم يتم تحديده بعد"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">طريقة الشحن</p>
                  <p className="font-semibold">{store.shipping_method === "vendor" ? "بواسطة التاجر" : "شركة الشحن"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المدينة</p>
                  <p className="font-semibold">{store.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">حالة المتجر</p>
                  <p className="font-semibold">{store.is_approved ? "موافق عليه" : "قيد المراجعة"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {store && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="gradient-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </CardContent>
            </Card>

            <Card className="gradient-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>

            <Card className="gradient-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} ر.س</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        {store && (
          <Tabs defaultValue="products" className="space-y-4">
            <TabsList>
              <TabsTrigger value="products">المنتجات</TabsTrigger>
              <TabsTrigger value="orders">الطلبات</TabsTrigger>
            </TabsList>

            {/* Products */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">منتجاتي</h2>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary">
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة منتج
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>إضافة منتج جديد</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div>
                        <Label htmlFor="name">اسم المنتج</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea id="description" name="description" />
                      </div>
                      <div>
                        <Label htmlFor="price">السعر</Label>
                        <Input id="price" name="price" type="number" required />
                      </div>
                      <div>
                        <Label htmlFor="discount_price">سعر الخصم</Label>
                        <Input id="discount_price" name="discount_price" type="number" />
                      </div>
                      <div>
                        <Label htmlFor="category">الفئة</Label>
                        <Input id="category" name="category" required />
                      </div>
                      <div>
                        <Label htmlFor="image_url">رابط الصورة</Label>
                        <Input id="image_url" name="image_url" type="url" />
                      </div>

                      <Button type="submit" className="w-full" disabled={isAddingProduct}>
                        {isAddingProduct ? "جاري الإضافة..." : "إضافة"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Product List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden gradient-border">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                    )}

                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary">
                          {product.discount_price || product.price} ر.س
                        </span>
                        {product.discount_price && (
                          <span className="text-sm line-through text-muted-foreground">{product.price} ر.س</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 ml-1" />
                          حذف
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders">
              <h2 className="text-2xl font-bold mb-4">الطلبات</h2>

              <div className="space-y-4">
                {orders.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{item.product?.name || "منتج محذوف"}</h3>

                          <p className="text-sm text-muted-foreground">
                            الكمية: {item.quantity} × {item.product?.price} ر.س
                          </p>

                          <p className="text-sm font-bold mt-2">الإجمالي: {item.subtotal} ر.س</p>
                        </div>

                        <div className="text-left">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {item.order?.status}
                          </span>

                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(item.created_at).toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
}
