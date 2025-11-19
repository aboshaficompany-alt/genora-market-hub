import { Link } from "react-router-dom";
import { stores } from "@/data/stores";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Package, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Stores = () => {
  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-black text-charcoal mb-6">
              جميع <span className="bg-gradient-primary bg-clip-text text-transparent">المتاجر</span>
            </h1>
            <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
              استكشف مجموعة واسعة من المتاجر الموثوقة في مختلف التخصصات
            </p>
          </div>

          {/* Stores Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stores.map((store, index) => (
              <Link 
                key={store.id} 
                to={`/store/${store.id}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-glow transition-all duration-300 hover:scale-105 bg-white">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={store.image} 
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {store.verified && (
                      <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-card">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-primary text-primary-foreground font-bold shadow-card">
                        {store.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">
                      {store.name}
                    </h3>
                    <p className="text-charcoal-light mb-4 line-clamp-2">
                      {store.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-light fill-yellow-light" />
                        <span className="font-bold text-charcoal">{store.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-charcoal-light">
                        <Package className="w-5 h-5" />
                        <span>{store.products} منتج</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stores;
