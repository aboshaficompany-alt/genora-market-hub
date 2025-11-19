import { Card } from "@/components/ui/card";
import benefitShopping from "@/assets/benefit-shopping.jpg";
import benefitVendor from "@/assets/benefit-vendor.jpg";
import benefitVariety from "@/assets/benefit-variety.jpg";

const Benefits = () => {
  const benefits = [
    {
      title: "أسعار تنافسية",
      description: "مقارنة الأسعار بسهولة بين البائعين المختلفين للحصول على أفضل العروض",
      image: benefitShopping,
      color: "bg-pink-light",
      borderColor: "border-pink-accent",
    },
    {
      title: "تسوق سهل",
      description: "تصفح المنتجات والخدمات بسهولة من تجار مختلفين بشكل ملائم في مكان واحد",
      image: benefitVendor,
      color: "bg-yellow-glow",
      borderColor: "border-secondary",
    },
    {
      title: "خيارات متعددة",
      description: "عرض مجموعة واسعة من المنتجات والخدمات من العديد من البائعين وتلبية كل احتياج",
      image: benefitVariety,
      color: "bg-muted",
      borderColor: "border-primary",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-4 px-6 py-2 bg-gradient-card rounded-full">
            <span className="text-primary font-bold text-sm">لماذا جينورا؟</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-charcoal mb-6">
            فوائد <span className="bg-gradient-primary bg-clip-text text-transparent">التسوق</span>
          </h2>
          <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
            استمتع بتجربة تسوق فريدة مع مميزات حصرية
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className={`${benefit.color} p-8 rounded-[2rem] shadow-card hover:shadow-float transition-all duration-500 hover:scale-110 hover:-translate-y-4 border-4 ${benefit.borderColor} overflow-hidden group animate-fade-in relative`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="aspect-square rounded-3xl overflow-hidden mb-6 shadow-soft border-4 border-white group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={benefit.image} 
                    alt={benefit.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <h3 className="text-3xl font-black text-charcoal mb-4 text-center group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-charcoal-light text-center leading-relaxed text-lg">
                  {benefit.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
