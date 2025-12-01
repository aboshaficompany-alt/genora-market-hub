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
import { Badge } from "@/components/ui/badge";
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

interface Variant {
  id: string;
  attributes: Record<string, string>;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category: string | null;
  category_id: string | null;
  store_category_id?: string | null;
  image_url: string | null;
  in_stock: boolean;
  store_id: string;
  variants?: Variant[];
  attributes?: Record<string, any>;
  approval_status?: string;
  rejection_reason?: string | null;
  is_approved?: boolean;
}

interface Category {
  id: string;
  name_ar: string;
  is_active: boolean;
}

interface StoreCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  store_id: string;
}

export default function VendorProducts() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [store, setStore] = useState<any>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StoreCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    display_order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<string[]>([]);
  const [variantDialog, setVariantDialog] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<Partial<Variant>>({
    attributes: {},
    price: 0,
    quantity: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category: "",
    category_id: "",
    store_category_id: "",
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
    
    setProducts((productsData || []) as any);
    
    // Load categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    
    setCategories(categoriesData || []);
    
    // Load store categories (أصناف المتجر الداخلية)
    const { data: storeCategoriesData } = await supabase
      .from("store_categories")
      .select("*")
      .eq("store_id", storeData.id)
      .eq("is_active", true)
      .order("display_order");
    
    setStoreCategories(storeCategoriesData || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store) return;

    try {
      let imageUrls: string[] = [];
      
      // Upload multiple images if provided
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
          const filePath = `${store.id}/${fileName}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw new Error(`فشل رفع الصورة: ${uploadError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
          
          imageUrls.push(publicUrl);
        }
      }

      // استخدام الصورة الأولى كصورة رئيسية
      const mainImageUrl = imageUrls.length > 0 ? imageUrls[0] : (editingProduct?.image_url || null);

      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        category: formData.category || null,
        category_id: formData.category_id && formData.category_id !== "" ? formData.category_id : null,
        store_category_id: formData.store_category_id && formData.store_category_id !== "" ? formData.store_category_id : null,
        in_stock: formData.in_stock,
        image_url: mainImageUrl,
        variants: variants.length > 0 ? variants as any : null,
        attributes: imageUrls.length > 0 ? { images: imageUrls } as any : (editingProduct?.attributes || null),
        store_id: store.id,
        approval_status: 'pending',
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
      store_category_id: product.store_category_id || "",
      in_stock: product.in_stock,
    });
    
    // تحميل المتغيرات الموجودة
    if (product.variants) {
      try {
        const parsedVariants = typeof product.variants === 'string' 
          ? JSON.parse(product.variants) 
          : product.variants;
        setVariants(parsedVariants);
      } catch (e) {
        setVariants([]);
      }
    }
    
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
      store_category_id: "",
      in_stock: true,
    });
    setEditingProduct(null);
    setImageFiles([]);
    setVariants([]);
    setCategoryAttributes([]);
  };

  const handleAddVariant = () => {
    if (!currentVariant.attributes || Object.keys(currentVariant.attributes).length === 0) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب تحديد الخصائص",
      });
      return;
    }

    const newVariant: Variant = {
      id: Math.random().toString(),
      attributes: currentVariant.attributes!,
      price: currentVariant.price || 0,
      quantity: currentVariant.quantity || 0,
    };

    setVariants([...variants, newVariant]);
    setCurrentVariant({ attributes: {}, price: 0, quantity: 0 });
    setVariantDialog(false);
    
    toast({ title: "تم إضافة المتغير بنجاح" });
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId));
    toast({ title: "تم حذف المتغير بنجاح" });
  };

  const handleCategoryChange = async (categoryId: string) => {
    setFormData({ ...formData, category_id: categoryId });
    
    // تحميل خصائص الفئة
    const { data: categoryData } = await supabase
      .from("categories")
      .select("attributes")
      .eq("id", categoryId)
      .single();
    
    if (categoryData?.attributes) {
      try {
        const attrs = typeof categoryData.attributes === 'string' 
          ? JSON.parse(categoryData.attributes) 
          : categoryData.attributes;
        setCategoryAttributes(Array.isArray(attrs) ? attrs : []);
      } catch (e) {
        setCategoryAttributes([]);
      }
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store) return;

    try {
      const categoryData = {
        name: categoryFormData.name,
        description: categoryFormData.description,
        display_order: categoryFormData.display_order,
        store_id: store.id,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("store_categories")
          .update(categoryData)
          .eq("id", editingCategory.id);
        
        if (error) throw error;
        
        toast({ title: "تم تحديث الصنف بنجاح" });
      } else {
        const { error } = await supabase
          .from("store_categories")
          .insert(categoryData);
        
        if (error) throw error;
        
        toast({ title: "تم إضافة الصنف بنجاح" });
      }

      resetCategoryForm();
      loadData();
      setShowCategoryDialog(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    }
  };

  const handleEditCategory = (category: StoreCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      display_order: category.display_order,
    });
    setShowCategoryDialog(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;

    try {
      const { error } = await supabase
        .from("store_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "تم حذف الصنف بنجاح" });
      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      display_order: 0,
    });
    setEditingCategory(null);
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
            
            <div className="space-y-6">
              {/* أصناف المتجر */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>أصناف المتجر</CardTitle>
                  <Dialog open={showCategoryDialog} onOpenChange={(open) => {
                    setShowCategoryDialog(open);
                    if (!open) resetCategoryForm();
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
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div>
                          <Label>اسم الصنف</Label>
                          <Input
                            required
                            value={categoryFormData.name}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label>الوصف</Label>
                          <Textarea
                            value={categoryFormData.description}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label>ترتيب العرض</Label>
                          <Input
                            type="number"
                            value={categoryFormData.display_order}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, display_order: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1 bg-gradient-primary">
                            {editingCategory ? "تحديث" : "إضافة"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCategoryDialog(false)}
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
                        <TableHead>اسم الصنف</TableHead>
                        <TableHead>الوصف</TableHead>
                        <TableHead>الترتيب</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storeCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>{category.display_order}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {storeCategories.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            لا توجد أصناف. ابدأ بإضافة صنف جديد.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* المنتجات */}
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
                        <Label>الفئة الرئيسية</Label>
                        <Select 
                          value={formData.category_id} 
                          onValueChange={(val) => {
                            const selectedCat = categories.find(c => c.id === val);
                            setFormData({ 
                              ...formData, 
                              category_id: val,
                              category: selectedCat?.name_ar || ""
                            });
                            handleCategoryChange(val);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الفئة الرئيسية" />
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
                        <Label>الصنف داخل المتجر</Label>
                        <Select 
                          value={formData.store_category_id} 
                          onValueChange={(val) => {
                            setFormData({ 
                              ...formData, 
                              store_category_id: val
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الصنف" />
                          </SelectTrigger>
                          <SelectContent>
                            {storeCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>صور المنتج (متعددة)</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setImageFiles(files);
                          }}
                        />
                        {imageFiles.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            تم اختيار {imageFiles.length} صورة
                          </p>
                        )}
                      </div>

                      {/* إدارة المتغيرات */}
                      {categoryAttributes.length > 0 && (
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-bold">المتغيرات</Label>
                            <Dialog open={variantDialog} onOpenChange={setVariantDialog}>
                              <DialogTrigger asChild>
                                <Button type="button" size="sm" variant="outline">
                                  <Plus className="w-4 h-4 ml-1" />
                                  إضافة متغير
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>إضافة متغير جديد</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {categoryAttributes.map((attr: string) => (
                                    <div key={attr}>
                                      <Label>{attr}</Label>
                                      <Input
                                        placeholder={`أدخل ${attr}`}
                                        value={currentVariant.attributes?.[attr] || ""}
                                        onChange={(e) => setCurrentVariant({
                                          ...currentVariant,
                                          attributes: {
                                            ...currentVariant.attributes,
                                            [attr]: e.target.value
                                          }
                                        })}
                                      />
                                    </div>
                                  ))}
                                  
                                  <div>
                                    <Label>السعر</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={currentVariant.price || 0}
                                      onChange={(e) => setCurrentVariant({
                                        ...currentVariant,
                                        price: parseFloat(e.target.value)
                                      })}
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>الكمية</Label>
                                    <Input
                                      type="number"
                                      value={currentVariant.quantity || 0}
                                      onChange={(e) => setCurrentVariant({
                                        ...currentVariant,
                                        quantity: parseInt(e.target.value)
                                      })}
                                    />
                                  </div>
                                  
                                  <Button type="button" onClick={handleAddVariant} className="w-full">
                                    إضافة
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

                          {variants.length > 0 ? (
                            <div className="space-y-2">
                              {variants.map((variant) => (
                                <div key={variant.id} className="flex items-center justify-between p-2 border rounded">
                                  <div className="flex-1">
                                    <div className="flex gap-2 text-sm">
                                      {Object.entries(variant.attributes).map(([key, value]) => (
                                        <Badge key={key} variant="secondary">
                                          {key}: {value}
                                        </Badge>
                                      ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      السعر: {variant.price} ر.س | الكمية: {variant.quantity}
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteVariant(variant.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              لم يتم إضافة متغيرات بعد
                            </p>
                          )}
                        </div>
                      )}

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
                      <TableHead>المخزون</TableHead>
                      <TableHead>حالة الموافقة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: any) => (
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
                          {product.approval_status === "approved" ? (
                            <span className="text-green-600">معتمد</span>
                          ) : product.approval_status === "rejected" ? (
                            <span className="text-red-600">مرفوض</span>
                          ) : (
                            <span className="text-yellow-600">قيد المراجعة</span>
                          )}
                          {product.rejection_reason && (
                            <p className="text-xs text-red-600 mt-1">{product.rejection_reason}</p>
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
            </div>
          </main>
        </div>
        
        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
}