import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/use-mobile";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-warm" dir="rtl">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <div className="container mx-auto px-4 py-32">
          <div className="text-center animate-fade-in">
            <Heart className="w-24 h-24 mx-auto text-charcoal-light mb-6" />
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              لا توجد منتجات في المفضلة
            </h2>
            <p className="text-charcoal-light mb-8">
              ابدأ بإضافة منتجاتك المفضلة لسهولة العثور عليها لاحقاً
            </p>
            <Link to="/products">
              <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow">
                تصفح المنتجات
              </Button>
            </Link>
          </div>
        </div>
        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black text-charcoal mb-12 text-center animate-fade-in">
            منتجاتي <span className="bg-gradient-primary bg-clip-text text-transparent">المفضلة</span>
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product, index) => (
              <Card 
                key={product.id}
                className="overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-glow transition-all animate-fade-in group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  {product.discount && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white font-bold shadow-card text-lg px-3 py-1">
                        -{product.discount}%
                      </Badge>
                    </div>
                  )}
                  <Button
                    size="sm"
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-500 rounded-full w-10 h-10 p-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-xl font-bold text-charcoal mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-charcoal-light mb-4 line-clamp-2 text-sm">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Star className="w-4 h-4 text-yellow-light fill-yellow-light" />
                    <span className="font-bold text-charcoal">{product.rating}</span>
                    <span className="text-charcoal-light">({product.reviews} تقييم)</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
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
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    إضافة للسلة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {isMobile ? <MobileFooter /> : <Footer />}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Wishlist;
