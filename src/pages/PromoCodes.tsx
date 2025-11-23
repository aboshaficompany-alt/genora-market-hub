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
import { Percent, Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface PromoCode {
  id: string;
  code: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  max_uses: number;
  current_uses: number;
  min_order_amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export default function PromoCodes() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "amount",
    discount_value: "",
    max_uses: "1",
    min_order_amount: "0",
    start_date: "",
    end_date: "",
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
      loadPromoCodes();
    };
    checkAdmin();
  }, [user, authLoading]);

  const loadPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
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
      const codeData = {
        code: formData.code.toUpperCase(),
        discount_percentage: formData.discount_type === "percentage" ? parseFloat(formData.discount_value) : null,
        discount_amount: formData.discount_type === "amount" ? parseFloat(formData.discount_value) : null,
        max_uses: parseInt(formData.max_uses),
        min_order_amount: parseFloat(formData.min_order_amount),
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
      };

      if (editingCode) {
        const { error } = await supabase
          .from("promo_codes")
          .update(codeData)
          .eq("id", editingCode.id);

        if (error) throw error;
        toast({ title: "تم تحديث الكود بنجاح" });
      } else {
        const { error } = await supabase
          .from("promo_codes")
          .insert([{ ...codeData, current_uses: 0 }]);

        if (error) throw error;
        toast({ title: "تم إضافة الكود بنجاح" });
      }

      setDialogOpen(false);
      resetForm();
      loadPromoCodes();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكود؟")) return;

    try {
      const { error } = await supabase
        .from("promo_codes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "تم حذف الكود بنجاح" });
      loadPromoCodes();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      discount_type: code.discount_percentage ? "percentage" : "amount",
      discount_value: (code.discount_percentage || code.discount_amount || 0).toString(),
      max_uses: code.max_uses.toString(),
      min_order_amount: code.min_order_amount.toString(),
      start_date: code.start_date.split("T")[0],
      end_date: code.end_date.split("T")[0],
      is_active: code.is_active,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCode(null);
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      max_uses: "1",
      min_order_amount: "0",
      start_date: "",
      end_date: "",
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
                  أكواد الخصم
                </h1>
                <p className="text-muted-foreground">إدارة أكواد البرومو والخصومات</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة كود
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingCode ? "تعديل الكود" : "إضافة كود جديد"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="code">الكود</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="SUMMER2024"
                        required
                      />
                    </div>
                    <div>
                      <Label>نوع الخصم</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="percentage"
                            checked={formData.discount_type === "percentage"}
                            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                          />
                          نسبة مئوية
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="amount"
                            checked={formData.discount_type === "amount"}
                            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                          />
                          قيمة ثابتة
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="discount_value">
                        {formData.discount_type === "percentage" ? "نسبة الخصم (%)" : "قيمة الخصم"}
                      </Label>
                      <Input
                        id="discount_value"
                        type="number"
                        min="0"
                        max={formData.discount_type === "percentage" ? "100" : undefined}
                        step="0.01"
                        value={formData.discount_value}
                        onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="max_uses">الحد الأقصى للاستخدام</Label>
                        <Input
                          id="max_uses"
                          type="number"
                          min="1"
                          value={formData.max_uses}
                          onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="min_order_amount">الحد الأدنى للطلب</Label>
                        <Input
                          id="min_order_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.min_order_amount}
                          onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_date">تاريخ البداية</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date">تاريخ النهاية</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                          required
                        />
                      </div>
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
                      {editingCode ? "تحديث" : "إضافة"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {promoCodes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Percent className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">لا توجد أكواد خصم حالياً</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>قائمة أكواد الخصم</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الكود</TableHead>
                        <TableHead>الخصم</TableHead>
                        <TableHead>الاستخدام</TableHead>
                        <TableHead>الحد الأدنى</TableHead>
                        <TableHead>الصلاحية</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promoCodes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell className="font-mono font-bold">{code.code}</TableCell>
                          <TableCell>
                            {code.discount_percentage 
                              ? `${code.discount_percentage}%` 
                              : `${code.discount_amount} ر.س`}
                          </TableCell>
                          <TableCell>{code.current_uses} / {code.max_uses}</TableCell>
                          <TableCell>{code.min_order_amount} ر.س</TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(code.start_date), "yyyy-MM-dd")} - {format(new Date(code.end_date), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell>
                            <Badge variant={code.is_active ? "default" : "secondary"}>
                              {code.is_active ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(code)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(code.id)}
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
