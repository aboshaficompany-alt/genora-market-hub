import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const RegistrationCTA = () => {
  const steps = [
    {
      title: "الخطوات التالية",
      items: [
        "تسجيل الدخول",
        "إدارة الطلبات بكل",
        "الحصول على عروض حصرية",
      ],
    },
    {
      title: "استعراض المتاجر",
      items: [
        "استعراض العلامات التجارية",
        "مقارنة المنتجات والأسعار",
        "العثور على أفضل العروض",
      ],
    },
    {
      title: "طرق الدفع",
      items: [
        "تعرف على طرق الدفع المتاحة",
        "اختر الوسيلة الأنسب",
        "تسوق بثقة وأمان",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-charcoal mb-16 animate-fade-in">
          الخطوات التالية
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="bg-secondary p-8 rounded-3xl border-0 shadow-card hover:shadow-soft transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-2xl font-bold text-charcoal mb-6 text-center">
                {step.title}
              </h3>
              
              <ul className="space-y-4">
                {step.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    className="flex items-start gap-3 text-right"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-charcoal-light flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-6 rounded-full shadow-card hover:shadow-soft transition-all hover:scale-105"
          >
            سجل الآن وابدأ التسوق
            <ArrowLeft className="mr-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RegistrationCTA;
