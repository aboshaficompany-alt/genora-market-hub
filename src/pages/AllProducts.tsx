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
import { Package } from "lucide-react";

export default function AllProducts() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);

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
      loadProducts();
    };
    checkAdmin();
  }, [user, authLoading]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, stores(name)")
      .order("created_at", { ascending: false });
    setProducts(data || []);
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
                جميع المنتجات
              </h1>
              <p className="text-muted-foreground">عرض وإدارة جميع المنتجات في المنصة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                    )}
                    <h3 className="font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.stores?.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{product.price} ر.س</span>
                      <Badge variant={product.in_stock ? "default" : "secondary"}>
                        {product.in_stock ? "متوفر" : "غير متوفر"}
                      </Badge>
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
