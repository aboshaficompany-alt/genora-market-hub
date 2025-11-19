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
    },
    {
      title: "تسوق سهل",
      description: "تصفح المنتجات والخدمات بسهولة من تجار مختلفين بشكل ملائم في مكان واحد",
      image: benefitVendor,
    },
    {
      title: "خيارات متعددة",
      description: "عرض مجموعة واسعة من المنتجات والخدمات من العديد من البائعين وتلبية كل احتياج",
      image: benefitVariety,
    },
  ];

  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-charcoal mb-16 animate-fade-in">
          فوائد التسوق
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="bg-card p-6 rounded-3xl shadow-card hover:shadow-soft transition-all duration-300 hover:scale-105 hover:-translate-y-2 border-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                <img 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-charcoal mb-4 text-center">
                {benefit.title}
              </h3>
              
              <p className="text-charcoal-light text-center leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
