import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  Home,
  Store as StoreIcon,
  Zap,
  Shield,
  Wifi,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      toast.success("تم تثبيت التطبيق بنجاح! 🎉");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error("التطبيق غير قابل للتثبيت حالياً");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      toast.success("جاري تثبيت التطبيق...");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const features = [
    {
      icon: Zap,
      title: "سريع وسلس",
      description: "تحميل فوري وأداء محسّن",
    },
    {
      icon: Wifi,
      title: "يعمل بدون إنترنت",
      description: "تصفح المنتجات حتى بدون اتصال",
    },
    {
      icon: Shield,
      title: "آمن وموثوق",
      description: "بياناتك محمية بأحدث التقنيات",
    },
  ];

  const installSteps = [
    {
      icon: Share2,
      title: "1. افتح قائمة المشاركة",
      description: 'اضغط على زر "مشاركة" في متصفحك',
    },
    {
      icon: Home,
      title: "2. أضف إلى الشاشة الرئيسية",
      description: 'اختر "إضافة إلى الشاشة الرئيسية"',
    },
    {
      icon: CheckCircle2,
      title: "3. ابدأ الاستخدام",
      description: "افتح التطبيق من شاشتك الرئيسية",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <div className="container mx-auto px-4 pt-24 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-3xl mb-6 shadow-glow">
            <StoreIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            ثبّت تطبيق <span className="bg-gradient-primary bg-clip-text text-transparent">Geenora</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            احصل على تجربة تسوق أفضل من خلال تثبيت التطبيق على جهازك
          </p>
        </div>

        {/* Install Status */}
        {isInstalled ? (
          <Card className="max-w-md mx-auto mb-12 border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <div>
                  <h3 className="font-bold text-lg text-green-900 dark:text-green-100">
                    التطبيق مثبّت بالفعل! 🎉
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    يمكنك الآن الوصول إلى Geenora من الشاشة الرئيسية
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Install Button */}
            {isInstallable && (
              <div className="max-w-md mx-auto mb-12 animate-fade-in">
                <Button
                  onClick={handleInstallClick}
                  size="lg"
                  className="w-full h-16 text-lg font-bold bg-gradient-primary hover:shadow-glow"
                >
                  <Download className="w-6 h-6 ml-2" />
                  تثبيت التطبيق الآن
                </Button>
              </div>
            )}

            {/* Manual Installation Steps */}
            {!isInstallable && (
              <Card className="max-w-2xl mx-auto mb-12">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-primary" />
                    خطوات التثبيت اليدوي
                  </CardTitle>
                  <CardDescription>
                    اتبع هذه الخطوات لتثبيت التطبيق على جهازك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {installSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-start animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white">
                          <step.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Features Grid */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">لماذا تثبيت التطبيق؟</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/">
            <Button variant="outline" size="lg" className="rounded-full">
              <Home className="w-5 h-5 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>

      {isMobile ? <MobileFooter /> : <Footer />}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Install;
