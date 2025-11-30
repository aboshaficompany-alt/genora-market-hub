import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User, MapPin, Package, Heart, LogOut, Camera } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadProfile();
    loadNotifications();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          postal_code: data.postal_code || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("user_notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("تم تحديث الملف الشخصي بنجاح");
      loadProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("فشل في تحديث الملف الشخصي");
    } finally {
      setSaving(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
      loadNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" dir="rtl">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-xl">جاري التحميل...</p>
        </div>
        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                      {formData.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gradient-primary"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {formData.full_name || "المستخدم"}
                  </h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <Button onClick={signOut} variant="destructive">
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 ml-2" />
                الملف الشخصي
              </TabsTrigger>
              <TabsTrigger value="address">
                <MapPin className="w-4 h-4 ml-2" />
                العنوان
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="w-4 h-4 ml-2" />
                الطلبات
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 ml-2" />
                الإشعارات
                {notifications.filter((n) => !n.is_read).length > 0 && (
                  <span className="mr-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter((n) => !n.is_read).length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الشخصية</CardTitle>
                  <CardDescription>قم بتحديث معلوماتك الشخصية</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">الاسم الكامل</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                          }
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={saving} className="bg-gradient-primary">
                      {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>عنوان الشحن</CardTitle>
                  <CardDescription>أدخل عنوانك لتسريع عملية الشحن</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="الشارع، الحي، رقم المبنى..."
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">المدينة</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder="الرياض، جدة، الدمام..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal_code">الرمز البريدي</Label>
                        <Input
                          id="postal_code"
                          value={formData.postal_code}
                          onChange={(e) =>
                            setFormData({ ...formData, postal_code: e.target.value })
                          }
                          placeholder="12345"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={saving} className="bg-gradient-primary">
                      {saving ? "جاري الحفظ..." : "حفظ العنوان"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>طلباتي</CardTitle>
                  <CardDescription>تتبع طلباتك وحالتها</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد طلبات بعد</p>
                    <Button className="mt-4 bg-gradient-primary" onClick={() => navigate("/products")}>
                      ابدأ التسوق
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>الإشعارات</CardTitle>
                  <CardDescription>آخر التحديثات والعروض</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">لا توجد إشعارات</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border transition-all ${
                            notification.is_read
                              ? "bg-background"
                              : "bg-primary/5 border-primary/20"
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.created_at).toLocaleDateString("ar-SA")}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isMobile ? <MobileFooter /> : <Footer />}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Profile;
