import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import { Badge } from "@/components/ui/badge";

export default function WithdrawalRequests() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [store, setStore] = useState<any>(null);
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
      
      if (vendorStatus) {
        const { data: storeData } = await supabase
          .from("stores")
          .select("*")
          .eq("vendor_id", user.id)
          .maybeSingle();
        setStore(storeData);
      }
      
      loadRequests();
    };
    checkAccess();
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    
    let query = supabase
      .from("withdrawal_requests")
      .select("*, store:stores(name), vendor:profiles(full_name)")
      .order("created_at", { ascending: false });
    
    if (!(await hasRole("admin"))) {
      query = query.eq("vendor_id", user.id);
    }
    
    const { data } = await query;
    setRequests(data || []);
  };

  const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !store) return;

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from("withdrawal_requests").insert({
      vendor_id: user.id,
      store_id: store.id,
      amount: parseFloat(formData.get("amount") as string),
      notes: formData.get("notes") as string,
    });

    if (!error) {
      toast({ title: "تم إرسال طلب السحب بنجاح" });
      setIsDialogOpen(false);
      loadRequests();
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("withdrawal_requests")
      .update({ status })
      .eq("id", id);

    if (!error) {
      toast({ title: "تم تحديث الحالة بنجاح" });
      loadRequests();
    }
  };

  const Sidebar = isAdmin ? AdminSidebar : VendorSidebar;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        
        <div className="flex flex-1 w-full">
          <Sidebar />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                طلبات السحب
              </h1>
              
              {!isAdmin && store && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="ml-2 h-4 w-4" />
                      طلب سحب جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إنشاء طلب سحب</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateRequest} className="space-y-4">
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
                        <Label htmlFor="notes">ملاحظات</Label>
                        <Textarea id="notes" name="notes" />
                      </div>
                      <Button type="submit" className="w-full">
                        إرسال الطلب
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>
                        {request.store?.name || "متجر غير معروف"}
                        {isAdmin && ` - ${request.vendor?.full_name || "تاجر غير معروف"}`}
                      </CardTitle>
                      <Badge variant={
                        request.status === "approved" ? "default" :
                        request.status === "rejected" ? "destructive" :
                        "secondary"
                      }>
                        {request.status === "approved" ? "موافق عليه" :
                         request.status === "rejected" ? "مرفوض" :
                         "قيد المراجعة"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-2">{request.amount} ر.س</p>
                    {request.notes && (
                      <p className="text-sm text-muted-foreground mb-4">{request.notes}</p>
                    )}
                    {isAdmin && request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(request.id, "approved")}
                        >
                          <CheckCircle className="ml-2 h-4 w-4" />
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(request.id, "rejected")}
                        >
                          <XCircle className="ml-2 h-4 w-4" />
                          رفض
                        </Button>
                      </div>
                    )}
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
