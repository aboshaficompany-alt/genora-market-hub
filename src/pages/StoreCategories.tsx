import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import Footer from "@/components/Footer";

interface StoreCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  store_id: string;
  stores?: {
    name: string;
  };
}

interface Store {
  id: string;
  name: string;
}

export default function StoreCategories() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StoreCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    display_order: 0,
    is_active: true,
    store_id: "",
  });

  useEffect(() => {
    checkAdminAndLoad();
  }, [user, authLoading]);

  const checkAdminAndLoad = async () => {
    if (authLoading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const isAdmin = await hasRole("admin");
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "غير مصرح",
        description: "هذه الصفحة متاحة للمدراء فقط",
      });
      navigate("/");
      return;
    }

    await loadData();
  };

  const loadData = async () => {
    setLoading(true);
    
    // Load stores
    const { data: storesData } = await supabase
      .from("stores")
      .select("id, name")
      .eq("is_approved", true)
      .order("name");
    
    setStores(storesData || []);
    
    // Load categories with store names
    const { data: categoriesData } = await supabase
      .from("store_categories")
      .select(`
        *,
        stores (
          name
        )
      `)
      .order("store_id")
      .order("display_order");
    
    setCategories(categoriesData || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        display_order: formData.display_order,
        is_active: formData.is_active,
        store_id: formData.store_id,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("store_categories")
          .update(categoryData)
          .eq("id", editingCategory.id);
        
        if (error) throw error;
        
        toast({ title: "تم التحديث بنجاح" });
      } else {
        const { error } = await supabase
          .from("store_categories")
          .insert(categoryData);
        
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

  const handleEdit = (category: StoreCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      display_order: category.display_order,
      is_active: category.is_active,
      store_id: category.store_id,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;

    try {
      const { error } = await supabase
        .from("store_categories")
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
      description: "",
      display_order: 0,
      is_active: true,
      store_id: "",
    });
    setEditingCategory(null);
  };

  if (authLoading || loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>إدارة أصناف المتاجر</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة صنف
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? "تعديل الصنف" : "إضافة صنف جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>المتجر</Label>
                      <Select 
                        required
                        value={formData.store_id} 
                        onValueChange={(val) => setFormData({ ...formData, store_id: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المتجر" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>اسم الصنف</Label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label>الوصف</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>ترتيب العرض</Label>
                      <Input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label>نشط</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-gradient-primary">
                        {editingCategory ? "تحديث" : "إضافة"}
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
                    <TableHead>المتجر</TableHead>
                    <TableHead>اسم الصنف</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>الترتيب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.stores?.name}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>{category.display_order}</TableCell>
                      <TableCell>
                        {category.is_active ? (
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
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {categories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        لا توجد أصناف. ابدأ بإضافة صنف جديد.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
