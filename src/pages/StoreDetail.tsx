import { useParams, Link } from "react-router-dom";
import { stores } from "@/data/stores";
import { products } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, ShieldCheck, Package, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const StoreDetail = () => {
  const { id } = useParams();
  const store = stores.find(s => s.id === Number(id));
  const storeProducts = products.filter(p => p.storeId === Number(id));

  if (!store) {
    return <div>المتجر غير موجود</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      
      {/* Store Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Card className="bg-white shadow-float border-2 border-primary/20 overflow-hidden">
            <div className="grid lg:grid-cols-3 gap-0">
              <div className="lg:col-span-1 h-80 lg:h-auto relative">
                <img 
                  src={store.image} 
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                {store.verified && (
                  <div className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-card">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>
              
              <CardContent className="lg:col-span-2 p-8 lg:p-12">
                <Badge className="bg-gradient-primary text-primary-foreground font-bold mb-4 text-lg px-4 py-2">
                  {store.category}
                </Badge>
                
                <h1 className="text-5xl font-black text-charcoal mb-4">
                  {store.name}
                </h1>
                
                <p className="text-xl text-charcoal-light mb-8">
                  {store.description}
                </p>
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-card rounded-2xl">
                    <Star className="w-8 h-8 text-yellow-light fill-yellow-light mx-auto mb-2" />
                    <div className="text-3xl font-black text-charcoal mb-1">{store.rating}</div>
                    <div className="text-sm text-charcoal-light">التقييم</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-card rounded-2xl">
                    <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-3xl font-black text-charcoal mb-1">{store.products}</div>
                    <div className="text-sm text-charcoal-light">منتج</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-card rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <div className="text-3xl font-black text-charcoal mb-1">موثق</div>
                    <div className="text-sm text-charcoal-light">معتمد</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full font-bold text-lg px-8">
                    <Mail className="ml-2 w-5 h-5" />
                    تواصل مع المتجر
                  </Button>
                  <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full font-bold text-lg px-8">
                    <Phone className="ml-2 w-5 h-5" />
                    اتصل الآن
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Store Products */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-charcoal mb-12 text-center">
            منتجات <span className="bg-gradient-primary bg-clip-text text-transparent">{store.name}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storeProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group"
              >
                <Card className="overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-glow transition-all duration-300 hover:scale-105 bg-white h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discount && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 text-white font-bold shadow-card text-lg px-3 py-1">
                          -{product.discount}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-charcoal-light mb-4 line-clamp-2 text-sm flex-1">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Star className="w-4 h-4 text-yellow-light fill-yellow-light" />
                      <span className="font-bold text-charcoal">{product.rating}</span>
                      <span className="text-charcoal-light">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black text-primary">
                          {product.price} ر.س
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-charcoal-light line-through">
                            {product.originalPrice} ر.س
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
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

export default StoreDetail;
