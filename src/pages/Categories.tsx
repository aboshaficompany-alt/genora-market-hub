import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Category {
  id: string;
  name_ar: string;
  icon: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const Categories = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    icon: "📦",
    description: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const checkAdmin = async () => {
      const isAdmin = await hasRole("admin");
      if (!isAdmin) {
        navigate("/");
        return;
      }
      loadCategories();
    };

    checkAdmin();
  }, [user, hasRole, navigate]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("فشل في تحميل الفئات");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(formData)
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        const { error } = await supabase.from("categories").insert([formData]);

        if (error) throw error;
        toast.success("تمت إضافة الفئة بنجاح");
      }

      setIsDialogOpen(false);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("فشل في حفظ الفئة");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      toast.success("تم حذف الفئة بنجاح");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("فشل في حذف الفئة");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_ar: category.name_ar,
      icon: category.icon,
      description: category.description || "",
      display_order: category.display_order,
      is_active: category.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name_ar: "",
      icon: "📦",
      description: "",
      display_order: 0,
      is_active: true,
    });
  };

  if (!user || loading) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-1 flex">
          <AdminSidebar />
          <main className="flex-1 p-8 bg-background">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">إدارة الفئات</CardTitle>
                    <CardDescription>
                      إضافة وتعديل وحذف فئات المنتجات
                    </CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة فئة جديدة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <form onSubmit={handleSubmit}>
                        <DialogHeader>
                          <DialogTitle>
                            {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingCategory
                              ? "قم بتعديل بيانات الفئة"
                              : "أدخل بيانات الفئة الجديدة"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name_ar">اسم الفئة</Label>
                            <Input
                              id="name_ar"
                              value={formData.name_ar}
                              onChange={(e) =>
                                setFormData({ ...formData, name_ar: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="icon">أيقونة (إيموجي)</Label>
                            <Input
                              id="icon"
                              value={formData.icon}
                              onChange={(e) =>
                                setFormData({ ...formData, icon: e.target.value })
                              }
                              placeholder="📦"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="description">الوصف</Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              placeholder="وصف مختصر للفئة"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="display_order">ترتيب العرض</Label>
                            <Input
                              id="display_order"
                              type="number"
                              value={formData.display_order}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  display_order: parseInt(e.target.value),
                                })
                              }
                              min="0"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="is_active">الفئة نشطة</Label>
                            <Switch
                              id="is_active"
                              checked={formData.is_active}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, is_active: checked })
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsDialogOpen(false);
                              resetForm();
                            }}
                          >
                            إلغاء
                          </Button>
                          <Button type="submit">
                            {editingCategory ? "تحديث" : "إضافة"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الترتيب</TableHead>
                      <TableHead>الأيقونة</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.display_order}</TableCell>
                        <TableCell className="text-2xl">{category.icon}</TableCell>
                        <TableCell className="font-medium">
                          {category.name_ar}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {category.description}
                        </TableCell>
                        <TableCell>
                          {category.is_active ? (
                            <span className="text-green-600">نشط</span>
                          ) : (
                            <span className="text-red-600">غير نشط</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(category.id)}
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
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Categories;
