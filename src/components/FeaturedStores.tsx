import storesRow from "@/assets/stores-row.jpg";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, TrendingUp, Shield, Zap } from "lucide-react";

const FeaturedStores = () => {
  const features = [
    {
      icon: TrendingUp,
      text: "منتجات عالية الجودة",
      color: "text-primary",
    },
    {
      icon: Shield,
      text: "خدمة عملاء ممتازة",
      color: "text-teal-accent",
    },
    {
      icon: Zap,
      text: "شحن سريع وموثوق",
      color: "text-pink-accent",
    },
  ];

  return (
    <section className="py-24 bg-gradient-warm relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-accent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="animate-fade-in group">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-[3rem]"></div>
              
              {/* Main image */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-float border-4 border-white group-hover:scale-105 transition-transform duration-700">
                <img 
                  src={storesRow} 
                  alt="متاجرنا المميزة"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-6 -left-6 bg-white rounded-3xl p-6 shadow-float animate-bounce">
                <Store className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Content side */}
          <div className="text-right animate-fade-in space-y-8">
            <div>
              <div className="inline-block mb-4 px-6 py-2 bg-white/80 rounded-full shadow-soft">
                <span className="text-primary font-bold text-sm">متاجر موثوقة</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-charcoal mb-6">
                اختيار <span className="bg-gradient-primary bg-clip-text text-transparent">المتاجر</span>
              </h2>
              <p className="text-xl text-charcoal-light leading-relaxed">
                نختار لك أفضل المتاجر والبائعين الموثوقين لضمان تجربة تسوق آمنة وممتعة
              </p>
            </div>
            
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-end gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-3xl shadow-soft hover:shadow-card transition-all duration-300 hover:scale-105 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-lg font-semibold text-charcoal">{feature.text}</span>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-card flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                </li>
              ))}
            </ul>
            
            <Button 
              size="lg"
              className="bg-gradient-primary hover:shadow-glow text-primary-foreground text-lg px-10 py-6 rounded-full shadow-card transition-all duration-500 hover:scale-110 font-bold"
            >
              استكشف المتاجر
              <ArrowLeft className="mr-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;
