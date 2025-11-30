import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Store, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  rating: number | null;
  reviews_count: number | null;
  in_stock: boolean;
  store_id: string;
  stores?: {
    name: string;
  };
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select(`
        *,
        stores(name)
      `)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (data) {
      setProducts(data);
    }
  };

  return (
    <section className="py-20 bg-gradient-warm relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-black text-charcoal mb-4">
            أحدث <span className="bg-gradient-primary bg-clip-text text-transparent">المنتجات</span>
          </h2>
          <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
            اكتشف أفضل المنتجات من متاجرنا المميزة
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-charcoal-light">
            لا توجد منتجات متاحة حالياً
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product, index) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-glow transition-all duration-300 hover:scale-105 bg-white h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Store className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {product.discount_price && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 text-white font-bold shadow-card text-sm px-2 py-1">
                          -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-sm text-charcoal-light">
                      <Store className="w-4 h-4" />
                      <span>{product.stores?.name || "متجر"}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-charcoal mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-charcoal-light mb-3 line-clamp-2 text-sm flex-1">
                      {product.description || "لا يوجد وصف"}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <Star className="w-4 h-4 text-yellow-light fill-yellow-light" />
                      <span className="font-bold text-charcoal">{product.rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-charcoal-light">({product.reviews_count || 0})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-black text-primary">
                          {product.discount_price || product.price} ر.س
                        </div>
                        {product.discount_price && (
                          <div className="text-sm text-charcoal-light line-through">
                            {product.price} ر.س
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.discount_price || product.price,
                              image: product.image_url || "",
                              storeName: product.stores?.name || "متجر",
                            });
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={isInWishlist(product.id) ? "default" : "outline"}
                          className="rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            if (isInWishlist(product.id)) {
                              removeFromWishlist(product.id);
                            } else {
                              addToWishlist({
                                id: product.id,
                                name: product.name,
                                price: product.discount_price || product.price,
                                image: product.image_url || "",
                                storeName: product.stores?.name || "متجر",
                              });
                            }
                          }}
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center animate-fade-in">
          <Link to="/products">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground font-bold px-8 py-6 text-lg rounded-xl hover:shadow-glow">
              عرض جميع المنتجات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}