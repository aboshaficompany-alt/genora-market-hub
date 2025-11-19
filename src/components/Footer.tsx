import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-charcoal py-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-primary-foreground mb-12 animate-fade-in">
          معلومات الاتصال
        </h2>
        
        <p className="text-center text-muted-foreground text-lg mb-10 animate-fade-in">
          نحن هنا لمساعدتك! تواصل معنا
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-soft hover:shadow-card transition-all animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            <Mail className="ml-3 h-5 w-5" />
            البريد الإلكتروني
            <span className="mr-2 text-sm opacity-80">info@geenora.net</span>
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-secondary text-primary-foreground hover:bg-secondary hover:text-charcoal rounded-full px-8 shadow-soft transition-all animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            <Phone className="ml-3 h-5 w-5" />
            الهاتف
            <span className="mr-2 text-sm opacity-80">123-456-7890</span>
          </Button>
        </div>
        
        <div className="text-center text-muted-foreground text-sm pt-8 border-t border-primary-foreground/10">
          <p className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            © 2024 Geenora. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
