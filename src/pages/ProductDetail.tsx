import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { products } from "@/data/products";
import { stores } from "@/data/stores";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ShoppingCart, Heart, Share2, Store, ShieldCheck, Truck, RotateCcw, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const store = product ? stores.find(s => s.id === product.storeId) : null;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      loadReviews();
    }
  }, [id]);

  const loadReviews = async () => {
    // Since we're using mock data, we'll create a mock reviews array
    // In a real app, this would fetch from the database
    setReviews([]);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "يجب تسجيل الدخول",
        description: "قم بتسجيل الدخول لإضافة تقييم",
      });
      return;
    }

    setSubmittingReview(true);
    
    // Mock review submission - in production this would save to database
    toast({
      title: "شكراً لتقييمك!",
      description: "تم إضافة تقييمك بنجاح",
    });

    setNewReview({ rating: 5, comment: "" });
    setSubmittingReview(false);
  };

  if (!product || !store) {
    return <div>المنتج غير موجود</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      
      {/* Product Details */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="animate-fade-in">
              <Card className="overflow-hidden border-4 border-white shadow-float">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-[600px] object-cover"
                  />
                  {product.discount && (
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-red-500 text-white font-bold shadow-card text-2xl px-6 py-3">
                        -{product.discount}%
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Product Info */}
            <div className="animate-fade-in space-y-6">
              <div>
                <Badge className="bg-gradient-primary text-primary-foreground font-bold mb-4 text-lg px-4 py-2">
                  {product.category}
                </Badge>
                
                <h1 className="text-5xl font-black text-charcoal mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-light fill-yellow-light" />
                    <span className="text-2xl font-bold text-charcoal">{product.rating}</span>
                    <span className="text-charcoal-light">({product.reviews} تقييم)</span>
                  </div>
                </div>
                
                <p className="text-xl text-charcoal-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Store Info */}
              <Link to={`/store/${store.id}`}>
                <Card className="bg-gradient-card hover:shadow-card transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary">
                  <CardContent className="p-6 flex items-center gap-4">
                    <img 
                      src={store.image} 
                      alt={store.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Store className="w-5 h-5 text-primary" />
                        <span className="font-bold text-charcoal text-lg">{product.storeName}</span>
                        {store.verified && <ShieldCheck className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-charcoal-light">
                        <Star className="w-4 h-4 text-yellow-light fill-yellow-light" />
                        <span>{store.rating}</span>
                        <span>•</span>
                        <span>{store.products} منتج</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Price */}
              <Card className="bg-white shadow-soft border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-5xl font-black text-primary">
                      {product.price} ر.س
                    </div>
                    {product.originalPrice && (
                      <div className="text-2xl text-charcoal-light line-through">
                        {product.originalPrice} ر.س
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4 mb-6">
                    <Button 
                      size="lg"
                      className="flex-1 bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full font-bold text-xl py-7"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="ml-2 w-6 h-6" />
                      أضف للسلة
                    </Button>
                    <Button 
                      size="lg"
                      variant={isInWishlist(product.id) ? "default" : "outline"}
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full"
                      onClick={() => {
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id);
                        } else {
                          addToWishlist(product);
                        }
                      }}
                    >
                      <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full"
                    >
                      <Share2 className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  {product.inStock ? (
                    <Badge className="bg-green-500 text-white font-bold text-lg px-4 py-2">
                      متوفر في المخزون
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white font-bold text-lg px-4 py-2">
                      غير متوفر حالياً
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-card">
                  <CardContent className="p-6 text-center">
                    <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-bold text-charcoal">شحن مجاني</div>
                    <div className="text-xs text-charcoal-light">للطلبات +200 ر.س</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card">
                  <CardContent className="p-6 text-center">
                    <RotateCcw className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <div className="font-bold text-charcoal">إرجاع مجاني</div>
                    <div className="text-xs text-charcoal-light">خلال 14 يوم</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card">
                  <CardContent className="p-6 text-center">
                    <ShieldCheck className="w-8 h-8 text-teal-accent mx-auto mb-2" />
                    <div className="font-bold text-charcoal">ضمان الجودة</div>
                    <div className="text-xs text-charcoal-light">منتجات أصلية</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 animate-fade-in">
            <h2 className="text-4xl font-black text-charcoal mb-8">
              التقييمات والمراجعات
            </h2>

            {user && (
              <Card className="mb-8 border-2">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">أضف تقييمك</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">التقييم</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= newReview.rating
                                  ? "text-yellow-light fill-yellow-light"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">تعليقك</label>
                      <Textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="شارك تجربتك مع هذا المنتج..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="bg-gradient-primary"
                      disabled={submittingReview}
                    >
                      <Send className="ml-2 w-4 h-4" />
                      {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-charcoal-light">
                      لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-light fill-yellow-light"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-charcoal-light">
                              {new Date(review.created_at).toLocaleDateString("ar-SA")}
                            </span>
                          </div>
                          <p className="text-charcoal">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
