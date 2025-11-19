const ProcessTimeline = () => {
  const steps = [
    {
      number: "01",
      title: "التسجيل",
      description: "إنشاء حساب مجاني",
    },
    {
      number: "02",
      title: "التصفح",
      description: "استكشف المنتجات من متاجر متعددة",
    },
    {
      number: "03",
      title: "الدفع",
      description: "اختر طريقة الدفع المناسبة",
    },
    {
      number: "04",
      title: "التوصيل",
      description: "استلم طلبك في الوقت المحدد",
    },
  ];

  return (
    <section className="py-20 bg-gradient-primary">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-primary-foreground mb-16 animate-fade-in">
          خط الوصول
        </h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-card text-charcoal text-2xl font-bold mb-6 shadow-card hover:scale-110 transition-transform">
                  {step.number}
                </div>
                
                <h3 className="text-2xl font-bold text-primary-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-primary-foreground/80">
                  {step.description}
                </p>
              </div>
              
              {/* Connector line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-[-4rem] w-32 h-1 bg-primary-foreground/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
