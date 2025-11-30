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
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/VendorSidebar";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category: string | null;
  category_id: string | null;
  image_url: string | null;
  in_stock: boolean;
  store_id: string;
}

interface Category {
  id: string;
  name_ar: string;
  is_active: boolean;
}

export default function VendorProducts() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category: "",
    category_id: "",
    in_stock: true,
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
    
    // Load products
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeData.id)
      .order("created_at", { ascending: false });
    
    setProducts(productsData || []);
    
    // Load categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    
    setCategories(categoriesData || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store) return;

    try {
      let imageUrl = editingProduct?.image_url || null;
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        category: formData.category,
        category_id: formData.category_id || null,
        in_stock: formData.in_stock,
        image_url: imageUrl,
        store_id: store.id,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        
        if (error) throw error;
        
        toast({ title: "تم التحديث بنجاح" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);
        
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      category: product.category || "",
      category_id: product.category_id || "",
      in_stock: product.in_stock,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const { error } = await supabase
        .from("products")
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
      price: "",
      discount_price: "",
      category: "",
      category_id: "",
      in_stock: true,
    });
    setEditingProduct(null);
    setImageFile(null);
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
                <CardTitle>إدارة المنتجات</CardTitle>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة منتج
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label>اسم المنتج</Label>
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
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>السعر</Label>
                          <Input
                            type="number"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label>سعر الخصم</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.discount_price}
                            onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>الفئة</Label>
                        <Select 
                          value={formData.category_id} 
                          onValueChange={(val) => {
                            const selectedCat = categories.find(c => c.id === val);
                            setFormData({ 
                              ...formData, 
                              category_id: val,
                              category: selectedCat?.name_ar || ""
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name_ar}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>صورة المنتج</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.in_stock}
                          onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                        />
                        <Label>متوفر في المخزون</Label>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1 bg-gradient-primary">
                          {editingProduct ? "تحديث" : "إضافة"}
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
                      <TableHead>الصورة</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div>
                            {product.discount_price && (
                              <div className="text-sm line-through text-muted-foreground">
                                {product.price} ر.س
                              </div>
                            )}
                            <div className="font-bold">
                              {product.discount_price || product.price} ر.س
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.in_stock ? (
                            <span className="text-green-500">متوفر</span>
                          ) : (
                            <span className="text-red-500">غير متوفر</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          لا توجد منتجات. ابدأ بإضافة منتج جديد.
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