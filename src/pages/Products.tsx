import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Store } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Products = () => {
  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-black text-charcoal mb-6">
              جميع <span className="bg-gradient-primary bg-clip-text text-transparent">المنتجات</span>
            </h1>
            <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
              تصفح آلاف المنتجات المميزة من أفضل المتاجر
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
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
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">غير متوفر</span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-sm text-charcoal-light">
                      <Store className="w-4 h-4" />
                      <span>{product.storeName}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-charcoal-light mb-4 line-clamp-2 text-sm flex-1">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Star className="w-4 h-4 text-yellow-light fill-yellow-light" />
                      <span className="font-bold text-charcoal">{product.rating}</span>
                      <span className="text-charcoal-light">({product.reviews} تقييم)</span>
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
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart functionality
                        }}
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

export default Products;
