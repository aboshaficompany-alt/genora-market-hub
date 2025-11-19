import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

const RegistrationCTA = () => {
  const steps = [
    {
      title: "تسجيل الدخول",
      items: [
        "إنشاء حساب مجاني",
        "إدارة الطلبات بسهولة",
        "الحصول على عروض حصرية",
      ],
      gradient: "from-pink-accent/20 to-pink-accent/5",
      borderColor: "border-pink-accent",
    },
    {
      title: "استعراض المتاجر",
      items: [
        "استعراض العلامات التجارية",
        "مقارنة المنتجات والأسعار",
        "العثور على أفضل العروض",
      ],
      gradient: "from-primary/20 to-primary/5",
      borderColor: "border-primary",
    },
    {
      title: "ابدأ التسوق",
      items: [
        "تعرف على طرق الدفع المتاحة",
        "اختر الوسيلة الأنسب لك",
        "تسوق بثقة وأمان تام",
      ],
      gradient: "from-secondary/20 to-secondary/5",
      borderColor: "border-secondary",
    },
  ];

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container px-4 mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            <h2 className="text-5xl lg:text-6xl font-black text-charcoal">
              ابدأ <span className="bg-gradient-primary bg-clip-text text-transparent">الآن</span>
            </h2>
          </div>
          <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
            انضم إلى آلاف العملاء السعداء واستمتع بتجربة تسوق لا مثيل لها
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className={`bg-gradient-to-br ${step.gradient} p-10 rounded-[2rem] border-4 ${step.borderColor} shadow-card hover:shadow-float transition-all duration-500 hover:scale-110 hover:-translate-y-2 animate-fade-in group backdrop-blur-sm`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Step number badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-charcoal font-black text-xl mb-6 shadow-soft group-hover:scale-110 group-hover:rotate-6 transition-all">
                {index + 1}
              </div>
              
              <h3 className="text-3xl font-black text-charcoal mb-8 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              
              <ul className="space-y-4">
                {step.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    className="flex items-start gap-3 text-right"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-charcoal-light text-lg flex-1 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="text-center">
          <div className="inline-block relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-30 blur-2xl rounded-full scale-150"></div>
            
            <Button 
              size="lg"
              className="relative bg-gradient-primary hover:shadow-glow text-primary-foreground text-2xl px-16 py-8 rounded-full shadow-float hover:scale-110 transition-all duration-500 font-black"
            >
              سجل الآن وابدأ التسوق
              <ArrowLeft className="mr-4 h-8 w-8" />
            </Button>
          </div>
          
          <p className="mt-8 text-charcoal-light text-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
            لا تحتاج إلى بطاقة ائتمان • التسجيل مجاني 100%
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegistrationCTA;
