import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  Package, 
  ShoppingCart, 
  Store, 
  Folder, 
  HelpCircle, 
  Calculator, 
  Gift,
  Copy,
  LogOut,
  Key,
  GitBranch
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/VendorSidebar";

export default function VendorDashboard() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVendor, setIsVendor] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [debt, setDebt] = useState(0);
  const [balance, setBalance] = useState(0);

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
  }, [user, authLoading, hasRole, navigate, toast]);

  const loadVendorData = async () => {
    if (!user) return;

    // Load store
    const { data: storeData } = await supabase.from("stores").select("*").eq("vendor_id", user.id).maybeSingle();
    setStore(storeData);

    if (storeData) {
      // Load debts
      const { data: debtsData } = await supabase
        .from("debts")
        .select("*")
        .eq("vendor_id", user.id)
        .eq("is_paid", false);
      
      const totalDebt = debtsData?.reduce((sum, debt) => sum + Number(debt.amount), 0) || 0;
      setDebt(totalDebt);

      // Calculate balance (placeholder - should be calculated based on sales and withdrawals)
      setBalance(0);
    }
  };

  const copyStoreLink = () => {
    if (store?.store_url) {
      navigator.clipboard.writeText(store.store_url);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط المتجر بنجاح",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const dashboardSections = [
    {
      title: "المنتجات",
      icon: Package,
      description: "إدارة منتجات المتجر",
      link: "/vendor-dashboard?tab=products",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "الأصناف",
      icon: Folder,
      description: "تصنيف المنتجات",
      link: "/vendor-dashboard?tab=categories",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "الفروع",
      icon: GitBranch,
      description: "إدارة فروع المتجر",
      link: "/vendor-dashboard?tab=branches",
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "معلومات المتجر",
      icon: Store,
      description: "تحديث بيانات المتجر",
      link: "/store-settings",
      color: "bg-orange-500/10 text-orange-500"
    },
    {
      title: "الدعم الفني",
      icon: HelpCircle,
      description: "المساعدة والدعم",
      link: "/support",
      color: "bg-red-500/10 text-red-500"
    },
    {
      title: "العمليات الحسابية",
      icon: Calculator,
      description: "التقارير المالية",
      link: "/vendor-dashboard?tab=accounting",
      color: "bg-yellow-500/10 text-yellow-500"
    },
    {
      title: "الطلبات",
      icon: ShoppingCart,
      description: "متابعة الطلبات",
      link: "/vendor-dashboard?tab=orders",
      color: "bg-cyan-500/10 text-cyan-500"
    },
    {
      title: "الخدمات الإضافية",
      icon: Gift,
      description: "خدمات إضافية",
      link: "/vendor-dashboard?tab=services",
      color: "bg-pink-500/10 text-pink-500"
    }
  ];

  if (authLoading || !isVendor) {
    return null;
  }

  const today = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        
        <div className="flex flex-1 w-full">
          <VendorSidebar />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            
            {!store ? (
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                  لوحة تحكم التاجر
                </h1>
                <Card className="border-orange-500">
                  <CardContent className="p-6">
                    <p className="text-center mb-4">ليس لديك متجر مسجل بعد. يرجى تسجيل متجرك أولاً.</p>
                    <Link to="/vendor-registration" className="block">
                      <Button className="w-full bg-gradient-primary">سجل متجرك الآن</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Header Actions */}
                <div className="flex justify-end gap-2 mb-4">
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 ml-2" />
                    تغيير كلمة المرور
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 ml-2" />
                    خروج
                  </Button>
                </div>

                {/* Store Info Header */}
                <Card className="mb-8 gradient-border">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Right Side */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">اليوم:</div>
                          <div className="font-semibold text-primary">{today}</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">الشعار:</div>
                          {store.image_url ? (
                            <img src={store.image_url} alt={store.name} className="h-12 w-12 object-contain" />
                          ) : (
                            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                              <Store className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">المدير:</div>
                          <div className="font-semibold">{store.owner_name || store.name}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">مرحباً:</div>
                          <div className="font-semibold text-primary">{user?.email}</div>
                        </div>
                      </div>

                      {/* Left Side */}
                      <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">المديونية المطلوبة:</span>
                            <span className="font-bold text-xl text-destructive">{debt} ر.س</span>
                          </div>
                          <Link to="/debts">
                            <Button size="sm" variant="outline" className="w-full">
                              تسديد المديونية
                            </Button>
                          </Link>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">رصيد محفظتك:</span>
                            <span className="font-bold text-xl text-primary">{balance} ر.س</span>
                          </div>
                          <Link to="/withdrawal-requests">
                            <Button size="sm" variant="outline" className="w-full">
                              سحب رصيد
                            </Button>
                          </Link>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-sm mb-2">رابط متجرك الخاص:</div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={store.store_url || ""}
                              readOnly
                              className="flex-1 px-3 py-2 bg-background border rounded text-sm"
                            />
                            <Button size="sm" onClick={copyStoreLink}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Sections */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">الرئيسية</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardSections.map((section, index) => (
                      <Link key={index} to={section.link}>
                        <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <div className={`inline-flex p-4 rounded-full ${section.color} mb-4`}>
                              <section.icon className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                            <p className="text-sm text-muted-foreground">{section.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
}
