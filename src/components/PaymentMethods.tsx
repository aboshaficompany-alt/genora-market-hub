import paymentWorkspace from "@/assets/payment-workspace.jpg";
import { CreditCard, Wallet, Building2 } from "lucide-react";

const PaymentMethods = () => {
  const methods = [
    {
      icon: CreditCard,
      title: "بطاقات الائتمان",
      description: "ادفع بأمان باستخدام بطاقتك",
    },
    {
      icon: Wallet,
      title: "المحفظة الإلكترونية",
      description: "استخدم محفظتك الرقمية",
    },
    {
      icon: Building2,
      title: "التحويل البنكي",
      description: "حول مباشرة من حسابك",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-charcoal mb-16 animate-fade-in">
          طرق الدفع المتاحة
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Payment methods list */}
          <div className="space-y-6 order-2 md:order-1">
            {methods.map((method, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-6 rounded-2xl bg-muted hover:bg-gradient-hero transition-all duration-300 hover:shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                    <method.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                </div>
                
                <div className="text-right flex-1">
                  <h3 className="text-xl font-bold text-charcoal mb-2">
                    {method.title}
                  </h3>
                  <p className="text-charcoal-light">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Image side */}
          <div className="order-1 md:order-2 animate-scale-in">
            <div className="rounded-3xl overflow-hidden shadow-card">
              <img 
                src={paymentWorkspace} 
                alt="طرق الدفع"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
