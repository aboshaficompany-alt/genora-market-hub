import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Loader2, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentMethod {
  id: string;
  gateway_type: string;
  is_active: boolean;
  is_test_mode: boolean;
  api_key?: string;
  secret_key?: string;
  merchant_id?: string;
  bank_name?: string;
  account_number?: string;
  iban?: string;
  account_holder_name?: string;
}

export default function PaymentMethods() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activeTab, setActiveTab] = useState("stripe");

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
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
    setLoading(true);
    try {
      // Load store
      const { data: storeData } = await supabase
        .from("stores")
        .select("*")
        .eq("vendor_id", user!.id)
        .single();

      setStore(storeData);

      if (storeData) {
        // Load payment methods
        const { data: methodsData } = await supabase
          .from("payment_methods")
          .select("*")
          .eq("store_id", storeData.id);

        setPaymentMethods(methodsData || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePaymentMethod = async (gatewayType: string, data: any) => {
    if (!store) return;

    setSaving(true);
    try {
      const existingMethod = paymentMethods.find((m) => m.gateway_type === gatewayType);

      if (existingMethod) {
        // Update existing
        const { error } = await supabase
          .from("payment_methods")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingMethod.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("payment_methods").insert({
          store_id: store.id,
          vendor_id: user!.id,
          gateway_type: gatewayType,
          ...data,
        });

        if (error) throw error;
      }

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ بيانات وسيلة الدفع",
      });

      await loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف وسيلة الدفع؟")) return;

    try {
      const { error } = await supabase.from("payment_methods").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف وسيلة الدفع بنجاح",
      });

      await loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    }
  };

  const StripeForm = () => {
    const method = paymentMethods.find((m) => m.gateway_type === "stripe");
    const [formData, setFormData] = useState({
      api_key: method?.api_key || "",
      secret_key: method?.secret_key || "",
      is_active: method?.is_active || false,
      is_test_mode: method?.is_test_mode ?? true,
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Stripe
          </CardTitle>
          <CardDescription>قبول المدفوعات عبر Stripe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              احصل على مفاتيح API من{" "}
              <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-primary underline">
                لوحة تحكم Stripe
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="stripe-api-key">Publishable Key</Label>
            <Input
              id="stripe-api-key"
              placeholder="pk_test_..."
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe-secret-key">Secret Key</Label>
            <Input
              id="stripe-secret-key"
              type="password"
              placeholder="sk_test_..."
              value={formData.secret_key}
              onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="stripe-test-mode">وضع التجربة</Label>
            <Switch
              id="stripe-test-mode"
              checked={formData.is_test_mode}
              onCheckedChange={(checked) => setFormData({ ...formData, is_test_mode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="stripe-active">تفعيل</Label>
            <Switch
              id="stripe-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => savePaymentMethod("stripe", formData)} disabled={saving} className="flex-1">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
            {method && (
              <Button variant="destructive" onClick={() => deletePaymentMethod(method.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const TapForm = () => {
    const method = paymentMethods.find((m) => m.gateway_type === "tap");
    const [formData, setFormData] = useState({
      api_key: method?.api_key || "",
      secret_key: method?.secret_key || "",
      is_active: method?.is_active || false,
      is_test_mode: method?.is_test_mode ?? true,
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Tap Payments
          </CardTitle>
          <CardDescription>قبول المدفوعات عبر Tap</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              احصل على مفاتيح API من{" "}
              <a href="https://dashboard.tap.company/" target="_blank" className="text-primary underline">
                لوحة تحكم Tap
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="tap-api-key">Public Key</Label>
            <Input
              id="tap-api-key"
              placeholder="pk_test_..."
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tap-secret-key">Secret Key</Label>
            <Input
              id="tap-secret-key"
              type="password"
              placeholder="sk_test_..."
              value={formData.secret_key}
              onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="tap-test-mode">وضع التجربة</Label>
            <Switch
              id="tap-test-mode"
              checked={formData.is_test_mode}
              onCheckedChange={(checked) => setFormData({ ...formData, is_test_mode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="tap-active">تفعيل</Label>
            <Switch
              id="tap-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => savePaymentMethod("tap", formData)} disabled={saving} className="flex-1">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
            {method && (
              <Button variant="destructive" onClick={() => deletePaymentMethod(method.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const PayPalForm = () => {
    const method = paymentMethods.find((m) => m.gateway_type === "paypal");
    const [formData, setFormData] = useState({
      api_key: method?.api_key || "",
      secret_key: method?.secret_key || "",
      merchant_id: method?.merchant_id || "",
      is_active: method?.is_active || false,
      is_test_mode: method?.is_test_mode ?? true,
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            PayPal
          </CardTitle>
          <CardDescription>قبول المدفوعات عبر PayPal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              احصل على بيانات API من{" "}
              <a href="https://developer.paypal.com/" target="_blank" className="text-primary underline">
                PayPal Developer
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="paypal-client-id">Client ID</Label>
            <Input
              id="paypal-client-id"
              placeholder="AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9..."
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal-secret">Client Secret</Label>
            <Input
              id="paypal-secret"
              type="password"
              placeholder="EHx2aa0..."
              value={formData.secret_key}
              onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="paypal-test-mode">وضع التجربة (Sandbox)</Label>
            <Switch
              id="paypal-test-mode"
              checked={formData.is_test_mode}
              onCheckedChange={(checked) => setFormData({ ...formData, is_test_mode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="paypal-active">تفعيل</Label>
            <Switch
              id="paypal-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => savePaymentMethod("paypal", formData)} disabled={saving} className="flex-1">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
            {method && (
              <Button variant="destructive" onClick={() => deletePaymentMethod(method.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const MoyasarForm = () => {
    const method = paymentMethods.find((m) => m.gateway_type === "moyasar");
    const [formData, setFormData] = useState({
      api_key: method?.api_key || "",
      secret_key: method?.secret_key || "",
      is_active: method?.is_active || false,
      is_test_mode: method?.is_test_mode ?? true,
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Moyasar
          </CardTitle>
          <CardDescription>قبول المدفوعات عبر Moyasar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              احصل على مفاتيح API من{" "}
              <a href="https://moyasar.com/dashboard/" target="_blank" className="text-primary underline">
                لوحة تحكم Moyasar
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="moyasar-api-key">Publishable Key</Label>
            <Input
              id="moyasar-api-key"
              placeholder="pk_test_..."
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="moyasar-secret-key">Secret Key</Label>
            <Input
              id="moyasar-secret-key"
              type="password"
              placeholder="sk_test_..."
              value={formData.secret_key}
              onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="moyasar-test-mode">وضع التجربة</Label>
            <Switch
              id="moyasar-test-mode"
              checked={formData.is_test_mode}
              onCheckedChange={(checked) => setFormData({ ...formData, is_test_mode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="moyasar-active">تفعيل</Label>
            <Switch
              id="moyasar-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => savePaymentMethod("moyasar", formData)} disabled={saving} className="flex-1">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
            {method && (
              <Button variant="destructive" onClick={() => deletePaymentMethod(method.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const HyperPayForm = () => {
    const method = paymentMethods.find((m) => m.gateway_type === "hyperpay");
    const [formData, setFormData] = useState({
      api_key: method?.api_key || "",
      merchant_id: method?.merchant_id || "",
      is_active: method?.is_active || false,
      is_test_mode: method?.is_test_mode ?? true,
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            HyperPay
          </CardTitle>
          <CardDescription>قبول المدفوعات عبر HyperPay</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              احصل على بيانات الاتصال من{" "}
              <a href="https://www.hyperpay.com/" target="_blank" className="text-primary underline">
                HyperPay
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="hyperpay-access-token">Access Token</Label>
            <Input
              id="hyperpay-access-token"
              type="password"
              placeholder="OGE4Mjk0MTc0YjdlY2I..."
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hyperpay-entity-id">Entity ID</Label>
            <Input
              id="hyperpay-entity-id"
              placeholder="8a8294174b7ecb28014b9699..."
              value={formData.merchant_id}
              onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hyperpay-test-mode">وضع التجربة</Label>
            <Switch
              id="hyperpay-test-mode"
              checked={formData.is_test_mode}
              onCheckedChange={(checked) => setFormData({ ...formData, is_test_mode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hyperpay-active">تفعيل</Label>
            <Switch
              id="hyperpay-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => savePaymentMethod("hyperpay", formData)} disabled={saving} className="flex-1">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
            {method && (
              <Button variant="destructive" onClick={() => deletePaymentMethod(method.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const BankTransferForm = () => {
    const method = paymentMethods.find((m) => m.gateway_type === "bank_transfer");
    const [formData, setFormData] = useState({
      bank_name: method?.bank_name || "",
      account_number: method?.account_number || "",
      iban: method?.iban || "",
      account_holder_name: method?.account_holder_name || "",
      is_active: method?.is_active || false,
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            تحويل بنكي
          </CardTitle>
          <CardDescription>قبول المدفوعات عبر التحويل البنكي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank-name">اسم البنك</Label>
            <Input
              id="bank-name"
              placeholder="الراجحي، الأهلي، إلخ..."
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-holder">اسم صاحب الحساب</Label>
            <Input
              id="account-holder"
              value={formData.account_holder_name}
              onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-number">رقم الحساب</Label>
            <Input
              id="account-number"
              value={formData.account_number}
              onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              placeholder="SA..."
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="bank-active">تفعيل</Label>
            <Switch
              id="bank-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => savePaymentMethod("bank_transfer", formData)} disabled={saving} className="flex-1">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
            {method && (
              <Button variant="destructive" onClick={() => deletePaymentMethod(method.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <div className="flex-1 container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>يجب عليك تسجيل متجر أولاً قبل إضافة وسائل الدفع</AlertDescription>
          </Alert>
        </div>
        {isMobile ? <MobileFooter /> : <Footer />}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {isMobile ? <MobileNavbar /> : <Navbar />}

        <div className="flex flex-1 w-full">
          <VendorSidebar />

          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />

            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">وسائل الدفع</h1>
              <p className="text-muted-foreground">إدارة بوابات الدفع والحسابات البنكية</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="stripe">Stripe</TabsTrigger>
                <TabsTrigger value="tap">Tap</TabsTrigger>
                <TabsTrigger value="paypal">PayPal</TabsTrigger>
                <TabsTrigger value="moyasar">Moyasar</TabsTrigger>
                <TabsTrigger value="hyperpay">HyperPay</TabsTrigger>
                <TabsTrigger value="bank">تحويل بنكي</TabsTrigger>
              </TabsList>

              <TabsContent value="stripe">
                <StripeForm />
              </TabsContent>

              <TabsContent value="tap">
                <TapForm />
              </TabsContent>

              <TabsContent value="paypal">
                <PayPalForm />
              </TabsContent>

              <TabsContent value="moyasar">
                <MoyasarForm />
              </TabsContent>

              <TabsContent value="hyperpay">
                <HyperPayForm />
              </TabsContent>

              <TabsContent value="bank">
                <BankTransferForm />
              </TabsContent>
            </Tabs>
          </main>
        </div>

        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
}
