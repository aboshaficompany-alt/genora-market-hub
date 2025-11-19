import { Mail, Phone, Smile, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gradient-dark py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        {/* Brand section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            <h2 className="text-6xl font-black flex items-center gap-3">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Geenora</span>
              <Smile className="w-12 h-12 text-pink-accent" />
            </h2>
          </div>
          <p className="text-2xl text-white/70 font-semibold">
            المتاجر المتعددة
          </p>
        </div>
        
        {/* Contact info */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 animate-fade-in">
            معلومات الاتصال
          </h3>
          
          <p className="text-white/70 text-lg mb-8 animate-fade-in">
            نحن هنا لمساعدتك! تواصل معنا
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="mailto:info@geenora.net"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-primary hover:shadow-glow text-white rounded-full font-bold transition-all duration-500 hover:scale-110 animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              <Mail className="w-5 h-5" />
              <span>info@geenora.net</span>
            </a>
            
            <a 
              href="tel:1234567890"
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-full font-bold transition-all duration-500 hover:scale-110 animate-fade-in backdrop-blur-sm"
              style={{ animationDelay: '200ms' }}
            >
              <Phone className="w-5 h-5" />
              <span>123-456-7890</span>
            </a>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-12 py-12 border-y border-white/10">
          <div className="text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="text-5xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">500+</div>
            <div className="text-white/60">متجر موثوق</div>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="text-5xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">10K+</div>
            <div className="text-white/60">منتج متنوع</div>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="text-5xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">50K+</div>
            <div className="text-white/60">عميل سعيد</div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-white/50 text-sm pt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="flex items-center justify-center gap-2">
            © 2024 Geenora
            <span className="text-primary">•</span>
            جميع الحقوق محفوظة
            <span className="text-primary">•</span>
            صنع بـ ❤️ في السعودية
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
