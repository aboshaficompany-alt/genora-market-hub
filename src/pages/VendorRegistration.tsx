import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "أبها",
  "الأحساء",
];

export default function VendorRegistration() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    logo_url: "",
    city: "",
    owner_name: "",
    owner_id_number: "",
    owner_id_image_url: "",
    phone: "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
    loadCategories();
  }, [user, authLoading, navigate]);

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.name || !formData.description || 
        !formData.city || !formData.owner_name || !formData.owner_id_number || 
        !formData.phone) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
      });
      return;
    }

    setIsSubmitting(true);

    // أولاً، نضيف دور التاجر للمستخدم
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: user!.id, role: "vendor" });

    if (roleError && !roleError.message.includes("duplicate")) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحديث صلاحيات المستخدم",
      });
      setIsSubmitting(false);
      return;
    }

    // ثم ننشئ المتجر
    const { error: storeError } = await supabase.from("stores").insert({
      vendor_id: user!.id,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      image_url: formData.logo_url || null,
      city: formData.city,
      owner_name: formData.owner_name,
      owner_id_number: formData.owner_id_number,
      owner_id_image_url: formData.owner_id_image_url || null,
      phone: formData.phone,
      email: formData.email,
      is_approved: false,
    });

    if (storeError) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل إنشاء المتجر: " + storeError.message,
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "نجاح",
      description: "تم تسجيل متجرك بنجاح! سيتم مراجعته قريباً",
    });

    navigate("/vendor-dashboard");
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
              تسجيل متجر جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* القسم */}
              <div>
                <Label htmlFor="category">القسم *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر من القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name_ar}>
                        {cat.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اسم المتجر */}
              <div>
                <Label htmlFor="name">اسم المتجر - عربي *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* نبذة عن النشاط */}
              <div>
                <Label htmlFor="description">
                  نبذة عن نشاط/خدمات المتجر *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="min-h-[100px]"
                />
              </div>

              {/* صورة الشعار */}
              <div>
                <Label htmlFor="logo_url">رابط صورة شعار المتجر</Label>
                <Input
                  id="logo_url"
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                  placeholder="ستكون الصورة الإفتراضية في حال عدم رفع الشعار"
                />
              </div>

              {/* المدينة */}
              <div>
                <Label htmlFor="city">المدينة *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) =>
                    setFormData({ ...formData, city: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر من القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اسم المالك */}
              <div>
                <Label htmlFor="owner_name">اسم المالك - عربي *</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_name: e.target.value })
                  }
                  required
                />
              </div>

              {/* رقم الهوية */}
              <div>
                <Label htmlFor="owner_id_number">رقم الهوية *</Label>
                <Input
                  id="owner_id_number"
                  value={formData.owner_id_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      owner_id_number: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* صورة الهوية */}
              <div>
                <Label htmlFor="owner_id_image_url">رابط صورة الهوية</Label>
                <Input
                  id="owner_id_image_url"
                  type="url"
                  value={formData.owner_id_image_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      owner_id_image_url: e.target.value,
                    })
                  }
                />
              </div>

              {/* رقم الجوال */}
              <div>
                <Label htmlFor="phone">رقم الجوال *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  placeholder="05xxxxxxxx"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري التسجيل..." : "تسجيل المتجر"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
