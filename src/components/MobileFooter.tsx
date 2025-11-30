import { Mail, Phone } from "lucide-react";

const MobileFooter = () => {
  return (
    <footer className="bg-gradient-to-b from-secondary/30 to-secondary/50 py-8 pb-20" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Brand */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">
            Geenora
          </h3>
          <p className="text-muted-foreground text-sm">
            المتاجر المتعددة
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3 mb-6">
          <a
            href="mailto:info@geenora.net"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-primary text-primary-foreground rounded-full text-sm font-semibold"
          >
            <Mail className="w-4 h-4" />
            info@geenora.net
          </a>
          <a
            href="tel:1234567890"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-border rounded-full text-sm font-semibold"
          >
            <Phone className="w-4 h-4" />
            123-456-7890
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent">500+</div>
            <div className="text-xs text-muted-foreground">متجر</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent">10K+</div>
            <div className="text-xs text-muted-foreground">منتج</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent">50K+</div>
            <div className="text-xs text-muted-foreground">عميل</div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 Geenora • جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
