import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";

interface City {
  id: string;
  name: string;
  shipping_cost: number;
  is_active: boolean;
}

export default function Cities() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    shipping_cost: "",
    is_active: true,
  });

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
      loadCities();
    };
    checkAdmin();
  }, [user, authLoading]);

  const loadCities = async () => {
    try {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("name");

      if (error) throw error;
      setCities(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cityData = {
        name: formData.name,
        shipping_cost: parseFloat(formData.shipping_cost),
        is_active: formData.is_active,
      };

      if (editingCity) {
        const { error } = await supabase
          .from("cities")
          .update(cityData)
          .eq("id", editingCity.id);

        if (error) throw error;
        toast({ title: "تم تحديث المدينة بنجاح" });
      } else {
        const { error } = await supabase
          .from("cities")
          .insert([cityData]);

        if (error) throw error;
        toast({ title: "تم إضافة المدينة بنجاح" });
      }

      setDialogOpen(false);
      resetForm();
      loadCities();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المدينة؟")) return;

    try {
      const { error } = await supabase
        .from("cities")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "تم حذف المدينة بنجاح" });
      loadCities();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      shipping_cost: city.shipping_cost.toString(),
      is_active: city.is_active,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCity(null);
    setFormData({
      name: "",
      shipping_cost: "",
      is_active: true,
    });
  };

  if (authLoading || loading) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                  المدن
                </h1>
                <p className="text-muted-foreground">إدارة المدن المتاحة للتوصيل</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة مدينة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCity ? "تعديل المدينة" : "إضافة مدينة جديدة"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">اسم المدينة</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="الرياض"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_cost">تكلفة الشحن (ر.س)</Label>
                      <Input
                        id="shipping_cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.shipping_cost}
                        onChange={(e) => setFormData({ ...formData, shipping_cost: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="is_active">نشط</Label>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingCity ? "تحديث" : "إضافة"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {cities.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">لا توجد مدن مضافة حالياً</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>قائمة المدن</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المدينة</TableHead>
                        <TableHead>تكلفة الشحن</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cities.map((city) => (
                        <TableRow key={city.id}>
                          <TableCell className="font-medium">{city.name}</TableCell>
                          <TableCell>{city.shipping_cost} ر.س</TableCell>
                          <TableCell>
                            <Badge variant={city.is_active ? "default" : "secondary"}>
                              {city.is_active ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(city)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(city.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
