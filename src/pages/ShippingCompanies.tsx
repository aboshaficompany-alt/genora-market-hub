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
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Switch } from "@/components/ui/switch";

export default function ShippingCompanies() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<any[]>([]);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !(await hasRole("admin"))) {
        navigate("/");
      } else {
        loadCompanies();
      }
    };
    checkAccess();
  }, [user]);

  const loadCompanies = async () => {
    const { data } = await supabase
      .from("shipping_companies")
      .select("*")
      .order("created_at", { ascending: false });
    setCompanies(data || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const companyData = {
      name: formData.get("name") as string,
      cost: parseFloat(formData.get("cost") as string),
      is_active: formData.get("is_active") === "on",
    };

    if (editingCompany) {
      const { error } = await supabase
        .from("shipping_companies")
        .update(companyData)
        .eq("id", editingCompany.id);

      if (!error) {
        toast({ title: "تم التحديث بنجاح" });
      }
    } else {
      const { error } = await supabase
        .from("shipping_companies")
        .insert(companyData);

      if (!error) {
        toast({ title: "تمت الإضافة بنجاح" });
      }
    }

    setIsDialogOpen(false);
    setEditingCompany(null);
    loadCompanies();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      const { error } = await supabase
        .from("shipping_companies")
        .delete()
        .eq("id", id);

      if (!error) {
        toast({ title: "تم الحذف بنجاح" });
        loadCompanies();
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                إدارة شركات الشحن
              </h1>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingCompany(null)}>
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة شركة شحن
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCompany ? "تعديل شركة الشحن" : "إضافة شركة شحن جديدة"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">اسم الشركة</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingCompany?.name}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cost">تكلفة الشحن (ر.س)</Label>
                      <Input
                        id="cost"
                        name="cost"
                        type="number"
                        step="0.01"
                        defaultValue={editingCompany?.cost}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_active"
                        name="is_active"
                        defaultChecked={editingCompany?.is_active !== false}
                      />
                      <Label htmlFor="is_active">نشطة</Label>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingCompany ? "تحديث" : "إضافة"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {companies.map((company) => (
                <Card key={company.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{company.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingCompany(company);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">التكلفة: {company.cost} ر.س</p>
                    <p className="text-sm text-muted-foreground">
                      الحالة: {company.is_active ? "نشطة" : "غير نشطة"}
                    </p>
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
