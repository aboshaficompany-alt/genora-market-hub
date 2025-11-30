import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, XCircle, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  in_stock: boolean;
  is_approved: boolean;
  approval_status: string;
  rejection_reason: string | null;
  category: string | null;
  store_id: string;
  stores?: {
    name: string;
  };
}

export default function AllProducts() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    in_stock: true,
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
      loadProducts();
    };
    checkAdmin();
  }, [user, authLoading]);

  useEffect(() => {
    filterProductsByStatus();
  }, [products, filterStatus]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, stores(name)")
      .order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const filterProductsByStatus = () => {
    if (filterStatus === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.approval_status === filterStatus));
    }
  };

  const handleApprove = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          is_approved: true,
          approval_status: "approved",
          rejection_reason: null,
        })
        .eq("id", productId);

      if (error) throw error;

      toast.success("تمت الموافقة على المنتج بنجاح");
      loadProducts();
    } catch (error) {
      console.error("Error approving product:", error);
      toast.error("فشل في الموافقة على المنتج");
    }
  };

  const handleReject = async () => {
    if (!selectedProduct || !rejectionReason) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({
          is_approved: false,
          approval_status: "rejected",
          rejection_reason: rejectionReason,
        })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      toast.success("تم رفض المنتج");
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Error rejecting product:", error);
      toast.error("فشل في رفض المنتج");
    }
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editFormData.name,
          description: editFormData.description,
          price: parseFloat(editFormData.price),
          discount_price: editFormData.discount_price ? parseFloat(editFormData.discount_price) : null,
          in_stock: editFormData.in_stock,
        })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      toast.success("تم تحديث المنتج بنجاح");
      setShowEditDialog(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("فشل في تحديث المنتج");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast.success("تم حذف المنتج بنجاح");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("فشل في حذف المنتج");
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      in_stock: product.in_stock,
    });
    setShowEditDialog(true);
  };

  const openRejectDialog = (product: Product) => {
    setSelectedProduct(product);
    setShowRejectDialog(true);
  };

  if (authLoading) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">معتمد</Badge>;
      case "rejected":
        return <Badge variant="destructive">مرفوض</Badge>;
      case "pending":
        return <Badge variant="secondary">قيد المراجعة</Badge>;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full" dir="rtl">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">إدارة منتجات التجار</CardTitle>
                <CardDescription>الموافقة على المنتجات أو رفضها أو تعديلها أو حذفها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    onClick={() => setFilterStatus("all")}
                  >
                    الكل ({products.length})
                  </Button>
                  <Button
                    variant={filterStatus === "pending" ? "default" : "outline"}
                    onClick={() => setFilterStatus("pending")}
                  >
                    قيد المراجعة ({products.filter(p => p.approval_status === "pending").length})
                  </Button>
                  <Button
                    variant={filterStatus === "approved" ? "default" : "outline"}
                    onClick={() => setFilterStatus("approved")}
                  >
                    معتمد ({products.filter(p => p.approval_status === "approved").length})
                  </Button>
                  <Button
                    variant={filterStatus === "rejected" ? "default" : "outline"}
                    onClick={() => setFilterStatus("rejected")}
                  >
                    مرفوض ({products.filter(p => p.approval_status === "rejected").length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-48 object-cover" 
                      />
                    )}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        {getStatusBadge(product.approval_status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{product.stores?.name}</p>
                      
                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{product.price} ر.س</span>
                        <Badge variant={product.in_stock ? "default" : "secondary"}>
                          {product.in_stock ? "متوفر" : "غير متوفر"}
                        </Badge>
                      </div>

                      {product.rejection_reason && (
                        <div className="bg-red-50 p-2 rounded text-sm text-red-800">
                          <strong>سبب الرفض:</strong> {product.rejection_reason}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {product.approval_status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 bg-green-500 hover:bg-green-600"
                              onClick={() => handleApprove(product.id)}
                            >
                              <CheckCircle className="w-4 h-4 ml-1" />
                              موافقة
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => openRejectDialog(product)}
                            >
                              <XCircle className="w-4 h-4 ml-1" />
                              رفض
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                لا توجد منتجات لعرضها
              </div>
            )}
          </main>
        </div>
        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>رفض المنتج</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rejection_reason">سبب الرفض</Label>
              <Textarea
                id="rejection_reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="اكتب سبب رفض المنتج..."
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason}
            >
              رفض المنتج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit_name">اسم المنتج</Label>
              <Input
                id="edit_name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit_description">الوصف</Label>
              <Textarea
                id="edit_description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_price">السعر</Label>
                <Input
                  id="edit_price"
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit_discount_price">السعر بعد الخصم</Label>
                <Input
                  id="edit_discount_price"
                  type="number"
                  value={editFormData.discount_price}
                  onChange={(e) => setEditFormData({ ...editFormData, discount_price: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="edit_in_stock">متوفر في المخزون</Label>
              <Switch
                id="edit_in_stock"
                checked={editFormData.in_stock}
                onCheckedChange={(checked) => setEditFormData({ ...editFormData, in_stock: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEdit}>
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
