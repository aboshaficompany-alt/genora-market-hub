import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-marketplace.jpg";
import { ArrowLeft, Smile, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Right side - Content (appears first in RTL) */}
          <div className="text-center md:text-right order-2 md:order-1 animate-fade-in">
            <div className="flex items-center justify-center md:justify-end gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-charcoal animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold text-charcoal flex items-center gap-3">
                Geenora
                <Smile className="w-12 h-12" />
              </h1>
            </div>
            
            <p className="text-2xl md:text-3xl font-semibold text-charcoal-light mb-8">
              المتاجر المتعددة
            </p>
            
            <p className="text-lg md:text-xl text-charcoal mb-10 max-w-lg mx-auto md:mr-0">
              منصة تسوق متكاملة تجمع أفضل المتاجر والبائعين في مكان واحد. تسوق بثقة وسهولة من مجموعة واسعة من المنتجات
            </p>
            
            <div className="flex gap-4 justify-center md:justify-end">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-card transition-all hover:scale-105"
              >
                ابدأ التسوق الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Left side - Image (appears second in RTL) */}
          <div className="order-1 md:order-2 animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-500 hover:scale-105">
              <img 
                src={heroImage} 
                alt="منصة جينورا للمتاجر المتعددة"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
};

export default Hero;
