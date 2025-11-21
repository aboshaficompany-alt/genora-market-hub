import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PlanCard from "@/components/subscription/PlanCard";
import RegistrationSteps from "@/components/subscription/RegistrationSteps";
import { ArrowRight, ArrowLeft } from "lucide-react";

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
  plan_id: z.string().min(1, "يجب اختيار باقة"),
  category: z.string().min(1, "يجب اختيار القسم"),
  name: z.string().min(3, "اسم المتجر يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().min(20, "النبذة يجب أن تكون 20 حرف على الأقل"),
  city: z.string().min(1, "يجب اختيار المدينة"),
  owner_name: z.string().min(3, "اسم المالك يجب أن يكون 3 أحرف على الأقل"),
  owner_id_number: z.string().length(10, "رقم الهوية يجب أن يكون 10 أرقام"),
  phone: z.string().regex(/^(05|5)[0-9]{8}$/, "رقم الجوال غير صالح"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  commercial_registration: z.string().optional(),
  store_url: z.string().optional(),
});

interface SubscriptionPlan {
  id: string;
  name_ar: string;
  description_ar: string;
  price: number;
  features: string[];
}

export default function VendorRegistration() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [idImageFile, setIdImageFile] = useState<File | null>(null);
  const [idImagePreview, setIdImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan_id: "",
      category: "",
      name: "",
      description: "",
      city: "",
      owner_name: "",
      owner_id_number: "",
      phone: "",
      email: user?.email || "",
      commercial_registration: "",
      store_url: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
    loadCategories();
    loadPlans();
  }, [user, authLoading, navigate]);

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const loadPlans = async () => {
    const { data } = await supabase.from("subscription_plans").select("*").eq("is_active", true).order("display_order");
    if (data) {
      setPlans(
        data.map((plan) => ({
          id: plan.id,
          name_ar: plan.name_ar,
          description_ar: plan.description_ar || "",
          price: plan.price,
          features: (plan.features as string[]) || [],
        })),
      );
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["plan_id"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["category", "name", "description", "city"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["owner_name", "owner_id_number"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
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

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setUploading(true);

    try {
      let logoUrl = "";
      let idImageUrl = "";

      // رفع صورة الشعار
      if (logoFile) {
        const logoPath = `${user!.id}/logo-${Date.now()}.${logoFile.name.split(".").pop()}`;
        logoUrl = await uploadImage(logoFile, "store-logos", logoPath);
      }

      // رفع صورة الهوية
      if (idImageFile) {
        const idPath = `${user!.id}/id-${Date.now()}.${idImageFile.name.split(".").pop()}`;
        idImageUrl = await uploadImage(idImageFile, "id-images", idPath);
      }
      // أولاً، نضيف دور التاجر للمستخدم
      const { error: roleError } = await supabase.from("user_roles").insert({ user_id: user!.id, role: "vendor" });

      if (roleError && !roleError.message.includes("duplicate")) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "فشل تحديث صلاحيات المستخدم",
        });
        setIsSubmitting(false);
        return;
      }

      // حساب تاريخ انتهاء الاشتراك (شهر واحد من الآن)
      const subscriptionStart = new Date();
      const subscriptionEnd = new Date();
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

      // ثم ننشئ المتجر
      const { error: storeError } = await supabase.from("stores").insert({
        vendor_id: user!.id,
        plan_id: values.plan_id,
        subscription_start_date: subscriptionStart.toISOString(),
        subscription_end_date: subscriptionEnd.toISOString(),
        name: values.name,
        description: values.description,
        category: values.category,
        image_url: logoUrl || null,
        city: values.city,
        owner_name: values.owner_name,
        owner_id_number: values.owner_id_number,
        owner_id_image_url: idImageUrl || null,
        phone: values.phone,
        email: values.email,
        commercial_registration: values.commercial_registration || null,
        store_url: values.store_url || null,
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
        title: "تم التسجيل بنجاح! 🎉",
        description: "تم تسجيل متجرك وسيتم مراجعته من قبل الإدارة قريباً",
      });

      navigate("/vendor-dashboard");
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

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              انضم إلى منصتنا كتاجر
            </h1>
            <p className="text-muted-foreground text-lg">ابدأ رحلتك في عالم التجارة الإلكترونية معنا</p>
          </div>

          <RegistrationSteps currentStep={currentStep} />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentStep === 1 && "اختر الباقة المناسبة لك"}
                {currentStep === 2 && "معلومات المتجر"}
                {currentStep === 3 && "معلومات المالك"}
                {currentStep === 4 && "معلومات التواصل"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "اختر الباقة التي تناسب احتياجات متجرك"}
                {currentStep === 2 && "أدخل المعلومات الأساسية عن متجرك"}
                {currentStep === 3 && "معلومات مالك المتجر للتوثيق"}
                {currentStep === 4 && "معلومات التواصل والحساب البنكي"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {currentStep === 1 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="plan_id"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormControl>
                              <div className="grid md:grid-cols-2 gap-6">
                                {plans.map((plan, index) => (
                                  <PlanCard
                                    key={plan.id}
                                    id={plan.id}
                                    nameAr={plan.name_ar}
                                    descriptionAr={plan.description_ar}
                                    price={plan.price}
                                    features={plan.features}
                                    isSelected={field.value === plan.id}
                                    onSelect={field.onChange}
                                    isPopular={index === 2}
                                  />
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>القسم *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر من القائمة" />
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

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المتجر - عربي *</FormLabel>
                            <FormControl>
                              <Input placeholder="اسم متجرك" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نبذة عن نشاط/خدمات المتجر *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="اكتب نبذة تعريفية عن متجرك وخدماته..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label>صورة شعار المتجر</Label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors text-center">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {logoFile ? logoFile.name : "اضغط لرفع الشعار"}
                              </p>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                          </label>
                          {logoPreview && (
                            <div className="relative w-24 h-24">
                              <img src={logoPreview} alt="معاينة" className="w-full h-full object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => {
                                  setLogoFile(null);
                                  setLogoPreview("");
                                }}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المدينة *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر من القائمة" />
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
                        name="store_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رابط المتجر (إن وجد)</FormLabel>
                            <FormControl>
                              <Input type="url" placeholder="https://yourstore.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="owner_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المالك - عربي *</FormLabel>
                            <FormControl>
                              <Input placeholder="الاسم الكامل" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="owner_id_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهوية *</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" maxLength={10} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label>صورة الهوية *</Label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors text-center">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {idImageFile ? idImageFile.name : "اضغط لرفع صورة الهوية"}
                              </p>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleIdImageChange} />
                          </label>
                          {idImagePreview && (
                            <div className="relative w-24 h-24">
                              <img
                                src={idImagePreview}
                                alt="معاينة"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setIdImageFile(null);
                                  setIdImagePreview("");
                                }}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="commercial_registration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم السجل التجاري</FormLabel>
                            <FormControl>
                              <Input placeholder="اختياري" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-4">
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
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="bg-muted p-6 rounded-lg space-y-4">
                        <h3 className="font-semibold text-lg">ملخص التسجيل</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الباقة:</span>
                            <span className="font-medium">
                              {plans.find((p) => p.id === form.getValues("plan_id"))?.name_ar}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">اسم المتجر:</span>
                            <span className="font-medium">{form.getValues("name")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">المدينة:</span>
                            <span className="font-medium">{form.getValues("city")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    {currentStep > 1 && (
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                        <ArrowRight className="ml-2 h-4 w-4" />
                        السابق
                      </Button>
                    )}
                    {currentStep < 4 ? (
                      <Button type="button" onClick={nextStep} className="flex-1 bg-gradient-primary">
                        التالي
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting || uploading} className="flex-1 bg-gradient-primary">
                        {uploading ? "جاري رفع الصور..." : isSubmitting ? "جاري التسجيل..." : "إتمام التسجيل"}
                      </Button>
                    )}
                  </div>
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
