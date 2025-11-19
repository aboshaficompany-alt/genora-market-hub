import paymentWorkspace from "@/assets/payment-workspace.jpg";
import { CreditCard, Wallet, Building2, CheckCircle } from "lucide-react";

const PaymentMethods = () => {
  const methods = [
    {
      icon: CreditCard,
      title: "بطاقات الائتمان",
      description: "ادفع بأمان باستخدام بطاقتك",
      gradient: "bg-gradient-to-br from-pink-accent/20 to-pink-accent/5",
      iconBg: "bg-pink-accent",
    },
    {
      icon: Wallet,
      title: "المحفظة الإلكترونية",
      description: "استخدم محفظتك الرقمية",
      gradient: "bg-gradient-to-br from-primary/20 to-primary/5",
      iconBg: "bg-primary",
    },
    {
      icon: Building2,
      title: "التحويل البنكي",
      description: "حول مباشرة من حسابك",
      gradient: "bg-gradient-to-br from-teal-accent/20 to-teal-accent/5",
      iconBg: "bg-teal-accent",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-light/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-4 px-6 py-2 bg-gradient-card rounded-full">
            <span className="text-primary font-bold text-sm">طرق دفع آمنة</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-charcoal mb-6">
            طرق الدفع <span className="bg-gradient-primary bg-clip-text text-transparent">المتاحة</span>
          </h2>
          <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
            اختر من بين طرق دفع متنوعة وآمنة
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Payment methods list */}
          <div className="space-y-6 order-2 lg:order-1">
            {methods.map((method, index) => (
              <div 
                key={index}
                className={`group ${method.gradient} rounded-3xl p-8 shadow-soft hover:shadow-float transition-all duration-500 hover:scale-105 border-2 border-white animate-fade-in`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl ${method.iconBg} flex items-center justify-center shadow-card group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <method.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="text-right flex-1">
                    <h3 className="text-2xl font-black text-charcoal mb-3 group-hover:text-primary transition-colors">
                      {method.title}
                    </h3>
                    <p className="text-charcoal-light text-lg leading-relaxed mb-4">
                      {method.description}
                    </p>
                    <div className="flex items-center justify-end gap-2 text-primary">
                      <span className="text-sm font-bold">دفع آمن ومضمون</span>
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Image side */}
          <div className="order-1 lg:order-2 animate-scale-in">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-[3rem]"></div>
              
              {/* Main image */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-float border-4 border-white hover:scale-105 transition-transform duration-700">
                <img 
                  src={paymentWorkspace} 
                  alt="طرق الدفع"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating icon */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-primary rounded-3xl p-6 shadow-float animate-bounce">
                <CreditCard className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
