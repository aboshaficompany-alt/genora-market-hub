import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CheckCircle } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import { Badge } from "@/components/ui/badge";

export default function Debts() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [debts, setDebts] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        navigate("/");
        return;
      }
      
      const adminStatus = await hasRole("admin");
      const vendorStatus = await hasRole("vendor");
      
      if (!adminStatus && !vendorStatus) {
        navigate("/");
        return;
      }
      
      setIsAdmin(adminStatus);
      loadDebts();
    };
    checkAccess();
  }, [user]);

  const loadDebts = async () => {
    if (!user) return;
    
    let query = supabase
      .from("debts")
      .select("*, store:stores(name), vendor:profiles(full_name)")
      .order("created_at", { ascending: false });
    
    if (!(await hasRole("admin"))) {
      query = query.eq("vendor_id", user.id);
    }
    
    const { data } = await query;
    setDebts(data || []);
  };

  const handleCreateDebt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAdmin) return;

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from("debts").insert({
      vendor_id: formData.get("vendor_id") as string,
      store_id: formData.get("store_id") as string,
      amount: parseFloat(formData.get("amount") as string),
      description: formData.get("description") as string,
    });

    if (!error) {
      toast({ title: "تمت إضافة المديونية بنجاح" });
      setIsDialogOpen(false);
      loadDebts();
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    const { error } = await supabase
      .from("debts")
      .update({ is_paid: true })
      .eq("id", id);

    if (!error) {
      toast({ title: "تم تسديد المديونية بنجاح" });
      loadDebts();
    }
  };

  const Sidebar = isAdmin ? AdminSidebar : VendorSidebar;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        
        <div className="flex flex-1 w-full">
          <Sidebar />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                المديونيات
              </h1>
              
              {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة مديونية
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة مديونية جديدة</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateDebt} className="space-y-4">
                      <div>
                        <Label htmlFor="vendor_id">معرف التاجر</Label>
                        <Input
                          id="vendor_id"
                          name="vendor_id"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="store_id">معرف المتجر</Label>
                        <Input
                          id="store_id"
                          name="store_id"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">المبلغ (ر.س)</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea id="description" name="description" />
                      </div>
                      <Button type="submit" className="w-full">
                        إضافة
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-4">
              {debts.map((debt) => (
                <Card key={debt.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>
                        {debt.store?.name || "متجر غير معروف"}
                        {isAdmin && ` - ${debt.vendor?.full_name || "تاجر غير معروف"}`}
                      </CardTitle>
                      <Badge variant={debt.is_paid ? "default" : "destructive"}>
                        {debt.is_paid ? "مسددة" : "غير مسددة"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-2">{debt.amount} ر.س</p>
                    {debt.description && (
                      <p className="text-sm text-muted-foreground mb-4">{debt.description}</p>
                    )}
                    {isAdmin && !debt.is_paid && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsPaid(debt.id)}
                      >
                        <CheckCircle className="ml-2 h-4 w-4" />
                        تسديد
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
        
        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
}
