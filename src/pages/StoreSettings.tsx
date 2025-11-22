import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, X, Settings } from "lucide-react";

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

const formSchema = z.object({
  name: z.string().min(3, "اسم المتجر يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().min(20, "النبذة يجب أن تكون 20 حرف على الأقل"),
  category: z.string().min(1, "يجب اختيار القسم"),
  city: z.string().min(1, "يجب اختيار المدينة"),
  phone: z.string().regex(/^(05|5)[0-9]{8}$/, "رقم الجوال غير صالح"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  store_url: z.string().optional(),
  shipping_method: z.string().min(1, "يجب اختيار طريقة الشحن"),
  shipping_cost: z.string().optional(),
  bank_account: z.string().optional(),
  facebook: z.string().url("رابط غير صالح").optional().or(z.literal("")),
  instagram: z.string().url("رابط غير صالح").optional().or(z.literal("")),
  twitter: z.string().url("رابط غير صالح").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
});

export default function StoreSettings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [shippingCompanies, setShippingCompanies] = useState<any[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      city: "",
      phone: "",
      email: "",
      store_url: "",
      shipping_method: "vendor",
      shipping_cost: "0",
      bank_account: "",
      facebook: "",
      instagram: "",
      twitter: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      loadStoreData();
      loadCategories();
      loadShippingCompanies();
    }
  }, [user, authLoading, navigate]);

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const loadShippingCompanies = async () => {
    const { data } = await supabase
      .from("shipping_companies")
      .select("*")
      .eq("is_active", true);
    setShippingCompanies(data || []);
  };

  const loadStoreData = async () => {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("vendor_id", user!.id)
      .single();

    if (data) {
      setStore(data);
      const socialMedia = (data.social_media as any) || {};
      form.reset({
        name: data.name,
        description: data.description || "",
        category: data.category || "",
        city: data.city || "",
        phone: data.phone || "",
        email: data.email || "",
        store_url: data.store_url || "",
        shipping_method: data.shipping_method || "vendor",
        shipping_cost: String(data.shipping_cost || 0),
        bank_account: data.bank_account || "",
        facebook: socialMedia.facebook || "",
        instagram: socialMedia.instagram || "",
        twitter: socialMedia.twitter || "",
        whatsapp: socialMedia.whatsapp || "",
      });
      if (data.image_url) {
        setLogoPreview(data.image_url);
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const logoPath = `${user!.id}/logo-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('store-logos')
      .upload(logoPath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('store-logos')
      .getPublicUrl(data.path);
    
    return publicUrl;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!store) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لم يتم العثور على متجر مرتبط بحسابك",
      });
      return;
    }

    setIsSubmitting(true);
    setUploading(true);

    try {
      let logoUrl = store.image_url;

      if (logoFile) {
        logoUrl = await uploadImage(logoFile);
      }

      const socialMedia = {
        facebook: values.facebook || null,
        instagram: values.instagram || null,
        twitter: values.twitter || null,
        whatsapp: values.whatsapp || null,
      };

      const { error } = await supabase
        .from("stores")
        .update({
          name: values.name,
          description: values.description,
          category: values.category,
          city: values.city,
          phone: values.phone,
          email: values.email,
          store_url: values.store_url || null,
          shipping_method: values.shipping_method,
          shipping_cost: values.shipping_cost ? parseFloat(values.shipping_cost) : 0,
          bank_account: values.bank_account || null,
          social_media: socialMedia,
          image_url: logoUrl,
        })
        .eq("id", store.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "فشل تحديث إعدادات المتجر: " + error.message,
        });
      } else {
        toast({
          title: "تم التحديث بنجاح! 🎉",
          description: "تم تحديث إعدادات المتجر بنجاح",
        });
        loadStoreData();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
      });
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  if (authLoading || !store) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Settings className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                إعدادات المتجر
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              قم بتحديث معلومات متجرك وإعداداته
            </p>
          </div>

          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="text-2xl">معلومات المتجر</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* صورة الشعار */}
                  <div className="space-y-2">
                    <Label>صورة شعار المتجر</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {logoFile ? logoFile.name : "اضغط لرفع شعار جديد"}
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                      {logoPreview && (
                        <div className="relative w-32 h-32">
                          <img
                            src={logoPreview}
                            alt="معاينة"
                            className="w-full h-full object-cover rounded-lg shadow-card"
                          />
                          {logoFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setLogoFile(null);
                                setLogoPreview(store.image_url || "");
                              }}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                            >
                              <X className="w-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* المعلومات الأساسية */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المتجر *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>القسم *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name_ar}>
                                  {cat.name_ar}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نبذة عن المتجر *</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المدينة *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CITIES.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>طريقة الشحن *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vendor">بواسطة التاجر</SelectItem>
                              {shippingCompanies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name} - {company.cost} ر.س
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("shipping_method") === "vendor" && (
                    <FormField
                      control={form.control}
                      name="shipping_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تكلفة الشحن (ر.س)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* معلومات التواصل */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">معلومات التواصل</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الجوال *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="05xxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني *</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="store_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رابط المتجر (اختياري)</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://yourstore.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bank_account"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الحساب البنكي (اختياري)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* روابط التواصل الاجتماعي */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">روابط مواقع التواصل الاجتماعي</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>فيسبوك</FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="https://facebook.com/yourpage"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>إنستغرام</FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="https://instagram.com/yourpage"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تويتر / X</FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="https://twitter.com/yourpage"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>واتساب</FormLabel>
                            <FormControl>
                              <Input placeholder="966xxxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="w-full bg-gradient-primary text-lg py-6"
                  >
                    {uploading
                      ? "جاري رفع الصور..."
                      : isSubmitting
                      ? "جاري الحفظ..."
                      : "حفظ التغييرات"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
