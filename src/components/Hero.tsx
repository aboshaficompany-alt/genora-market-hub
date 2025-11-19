import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-marketplace.jpg";
import { ArrowLeft, Smile, Sparkles, ShoppingBag, Store } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-glow opacity-60"></div>
      <div className="absolute top-20 right-[10%] w-32 h-32 bg-yellow-light/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-[15%] w-48 h-48 bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-[5%] w-24 h-24 bg-pink-accent/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Right side - Content (appears first in RTL) */}
          <div className="text-center lg:text-right order-2 lg:order-1 animate-fade-in space-y-8">
            {/* Brand Header */}
            <div className="flex items-center justify-center lg:justify-end gap-4 mb-4">
              <div className="relative">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                <div className="absolute inset-0 w-10 h-10 bg-primary/20 rounded-full blur-xl"></div>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-charcoal flex items-center gap-4 relative">
                <span className="bg-gradient-primary bg-clip-text text-transparent">Geenora</span>
                <Smile className="w-14 h-14 text-pink-accent" />
              </h1>
            </div>
            
            {/* Subtitle with icon */}
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <Store className="w-8 h-8 text-primary" />
              <p className="text-3xl lg:text-4xl font-bold text-charcoal">
                المتاجر المتعددة
              </p>
            </div>
            
            {/* Description */}
            <p className="text-xl lg:text-2xl text-charcoal-light leading-relaxed max-w-2xl mx-auto lg:mr-0">
              اكتشف تجربة تسوق فريدة تجمع أفضل المتاجر والبائعين في منصة واحدة سهلة الاستخدام
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8 max-w-lg mx-auto lg:mr-0">
              <div className="text-center lg:text-right">
                <div className="text-4xl font-black text-primary mb-2">500+</div>
                <div className="text-sm text-charcoal-light">متجر</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-4xl font-black text-pink-accent mb-2">10K+</div>
                <div className="text-sm text-charcoal-light">منتج</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-4xl font-black text-secondary mb-2">50K+</div>
                <div className="text-sm text-charcoal-light">عميل</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <Link to="/products">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-glow text-primary-foreground shadow-float transition-all duration-500 hover:scale-110 text-lg px-8 py-6 rounded-full font-bold"
                >
                  <ShoppingBag className="ml-2 h-6 w-6" />
                  ابدأ التسوق الآن
                </Button>
              </Link>
              <Link to="/stores">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-soft transition-all duration-500 hover:scale-110 text-lg px-8 py-6 rounded-full font-bold"
                >
                  للبائعين: انضم الآن
                  <ArrowLeft className="mr-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Left side - Image (appears second in RTL) */}
          <div className="order-1 lg:order-2 animate-scale-in">
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-primary opacity-30 blur-3xl rounded-[3rem] scale-105"></div>
              
              {/* Main image */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-float hover:shadow-glow transition-all duration-700 hover:scale-105 hover:rotate-1 border-4 border-white/50">
                <img 
                  src={heroImage} 
                  alt="منصة جينورا للمتاجر المتعددة"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-3xl p-6 shadow-float animate-bounce">
                <div className="text-center">
                  <div className="text-3xl font-black text-primary">جديد</div>
                  <div className="text-sm text-charcoal-light">2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
