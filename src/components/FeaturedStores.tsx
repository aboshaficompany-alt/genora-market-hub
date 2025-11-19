import storesRow from "@/assets/stores-row.jpg";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FeaturedStores = () => {
  const features = [
    "منتجات عالية الجودة",
    "خدمة عملاء ممتازة",
    "شحن سريع وموثوق",
  ];

  return (
    <section className="py-20 bg-charcoal">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <div className="animate-fade-in">
            <div className="rounded-3xl overflow-hidden shadow-card">
              <img 
                src={storesRow} 
                alt="متاجرنا المميزة"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          {/* Content side */}
          <div className="text-right animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-8">
              اختيار المتاجر
            </h2>
            
            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-end gap-3 text-lg text-muted-foreground"
                >
                  <span>{feature}</span>
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </li>
              ))}
            </ul>
            
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-soft transition-all hover:scale-105"
            >
              استكشف المتاجر
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;
