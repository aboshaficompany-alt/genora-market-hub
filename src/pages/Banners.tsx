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

export default function Banners() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [banners, setBanners] = useState<any[]>([]);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !(await hasRole("admin"))) {
        navigate("/");
      } else {
        loadBanners();
      }
    };
    checkAccess();
  }, [user]);

  const loadBanners = async () => {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });
    setBanners(data || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const bannerData = {
      title: formData.get("title") as string,
      image_url: formData.get("image_url") as string,
      link: formData.get("link") as string,
      display_order: parseInt(formData.get("display_order") as string),
      is_active: formData.get("is_active") === "on",
    };

    if (editingBanner) {
      const { error } = await supabase
        .from("banners")
        .update(bannerData)
        .eq("id", editingBanner.id);

      if (!error) {
        toast({ title: "تم التحديث بنجاح" });
      }
    } else {
      const { error } = await supabase
        .from("banners")
        .insert(bannerData);

      if (!error) {
        toast({ title: "تمت الإضافة بنجاح" });
      }
    }

    setIsDialogOpen(false);
    setEditingBanner(null);
    loadBanners();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      const { error } = await supabase
        .from("banners")
        .delete()
        .eq("id", id);

      if (!error) {
        toast({ title: "تم الحذف بنجاح" });
        loadBanners();
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
                إدارة البانرات
              </h1>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingBanner(null)}>
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة بانر
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingBanner ? "تعديل البانر" : "إضافة بانر جديد"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">العنوان</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingBanner?.title}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="image_url">رابط الصورة</Label>
                      <Input
                        id="image_url"
                        name="image_url"
                        type="url"
                        defaultValue={editingBanner?.image_url}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="link">الرابط</Label>
                      <Input
                        id="link"
                        name="link"
                        type="url"
                        defaultValue={editingBanner?.link}
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_order">ترتيب العرض</Label>
                      <Input
                        id="display_order"
                        name="display_order"
                        type="number"
                        defaultValue={editingBanner?.display_order || 0}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_active"
                        name="is_active"
                        defaultChecked={editingBanner?.is_active !== false}
                      />
                      <Label htmlFor="is_active">نشط</Label>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingBanner ? "تحديث" : "إضافة"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {banners.map((banner) => (
                <Card key={banner.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{banner.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingBanner(banner);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={banner.image_url} 
                      alt={banner.title}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      الحالة: {banner.is_active ? "نشط" : "غير نشط"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      الترتيب: {banner.display_order}
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
