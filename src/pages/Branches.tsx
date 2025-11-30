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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import { GitBranch, Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  store_id: string;
}

export default function Branches() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    is_active: true,
  });

  useEffect(() => {
    checkVendorAndLoad();
  }, [user, authLoading]);

  const checkVendorAndLoad = async () => {
    if (authLoading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const isVendor = await hasRole("vendor");
    if (!isVendor) {
      toast({
        variant: "destructive",
        title: "غير مصرح",
        description: "هذه الصفحة متاحة للتجار فقط",
      });
      navigate("/");
      return;
    }

    await loadData();
  };

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Load store
    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .eq("vendor_id", user.id)
      .maybeSingle();
    
    if (!storeData) {
      toast({
        variant: "destructive",
        title: "لا يوجد متجر",
        description: "يجب تسجيل متجر أولاً",
      });
      navigate("/vendor-registration");
      return;
    }
    
    setStore(storeData);
    
    // Load branches
    const { data: branchesData } = await supabase
      .from("branches")
      .select("*")
      .eq("store_id", storeData.id)
      .order("created_at", { ascending: false });
    
    setBranches(branchesData || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store) return;

    try {
      const branchData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        is_active: formData.is_active,
        store_id: store.id,
      };

      if (editingBranch) {
        const { error } = await supabase
          .from("branches")
          .update(branchData)
          .eq("id", editingBranch.id);
        
        if (error) throw error;
        
        toast({ title: "تم التحديث بنجاح" });
      } else {
        const { error } = await supabase
          .from("branches")
          .insert(branchData);
        
        if (error) throw error;
        
        toast({ title: "تم الإضافة بنجاح" });
      }

      resetForm();
      loadData();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      city: branch.city || "",
      phone: branch.phone || "",
      email: branch.email || "",
      is_active: branch.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفرع؟")) return;

    try {
      const { error } = await supabase
        .from("branches")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "تم الحذف بنجاح" });
      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      is_active: true,
    });
    setEditingBranch(null);
  };

  if (authLoading || loading) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        
        <div className="flex flex-1 w-full">
          <VendorSidebar />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>إدارة الفروع</CardTitle>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة فرع
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingBranch ? "تعديل الفرع" : "إضافة فرع جديد"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label>اسم الفرع</Label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="مثال: الفرع الرئيسي"
                        />
                      </div>
                      
                      <div>
                        <Label>العنوان</Label>
                        <Input
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="العنوان الكامل للفرع"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>المدينة</Label>
                          <Input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="المدينة"
                          />
                        </div>
                        
                        <div>
                          <Label>رقم الهاتف</Label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="05xxxxxxxx"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>البريد الإلكتروني</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="branch@example.com"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label>فرع نشط</Label>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1 bg-gradient-primary">
                          {editingBranch ? "تحديث" : "إضافة"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الفرع</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>المدينة</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.map((branch) => (
                      <TableRow key={branch.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {branch.name}
                          </div>
                        </TableCell>
                        <TableCell>{branch.address}</TableCell>
                        <TableCell>{branch.city || "-"}</TableCell>
                        <TableCell>{branch.phone || "-"}</TableCell>
                        <TableCell>
                          {branch.is_active ? (
                            <span className="text-green-500">نشط</span>
                          ) : (
                            <span className="text-red-500">غير نشط</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(branch)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(branch.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {branches.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <GitBranch className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">لا توجد فروع مضافة. ابدأ بإضافة فرع جديد.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
        
        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
}
