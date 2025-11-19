import { UserPlus, Search, CreditCard, Package } from "lucide-react";

const ProcessTimeline = () => {
  const steps = [
    {
      number: "01",
      title: "التسجيل",
      description: "إنشاء حساب مجاني",
      icon: UserPlus,
      color: "bg-pink-accent",
    },
    {
      number: "02",
      title: "التصفح",
      description: "استكشف المنتجات من متاجر متعددة",
      icon: Search,
      color: "bg-primary",
    },
    {
      number: "03",
      title: "الدفع",
      description: "اختر طريقة الدفع المناسبة",
      icon: CreditCard,
      color: "bg-teal-accent",
    },
    {
      number: "04",
      title: "التوصيل",
      description: "استلم طلبك في الوقت المحدد",
      icon: Package,
      color: "bg-secondary",
    },
  ];

  return (
    <section className="py-24 bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container px-4 mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
            خط <span className="bg-gradient-primary bg-clip-text text-transparent">الوصول</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            أربع خطوات سهلة للبدء في رحلة التسوق
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative animate-fade-in group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-center">
                {/* Icon with glow effect */}
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl ${step.color} text-white text-3xl font-black mb-6 shadow-glow hover:scale-125 hover:rotate-12 transition-all duration-500 relative group-hover:shadow-float`}>
                  <step.icon className="w-12 h-12" />
                  
                  {/* Number badge */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white text-charcoal rounded-full flex items-center justify-center font-black text-sm shadow-card">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-white mb-4 group-hover:text-secondary transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-white/70 text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Animated connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 right-[-3rem] lg:right-[-6rem] w-24 lg:w-48 h-1 bg-gradient-to-r from-white/30 to-transparent overflow-hidden">
                  <div className="h-full w-1/2 bg-white/60 animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
