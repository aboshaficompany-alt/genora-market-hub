import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Star, ShoppingCart, Heart, Share2, Store, ShieldCheck, Truck, RotateCcw, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductImageGallery } from "@/components/ProductImageGallery";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [product, setProduct] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id]);

  const loadProductData = async () => {
    setLoading(true);
    
    // Load product from Supabase
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (!productData) {
      setLoading(false);
      return;
    }
    
    setProduct(productData);
    
    // تحميل الصور
    const images: string[] = [];
    if (productData.image_url) {
      images.push(productData.image_url);
    }
    if (productData.attributes?.images && Array.isArray(productData.attributes.images)) {
      images.push(...productData.attributes.images);
    }
    setProductImages(images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']);
    
    // تحميل المتغيرات
    if (productData.variants) {
      try {
        const parsedVariants = typeof productData.variants === 'string' 
          ? JSON.parse(productData.variants) 
          : productData.variants;
        setVariants(Array.isArray(parsedVariants) ? parsedVariants : []);
      } catch (e) {
        setVariants([]);
      }
    }
    
    // Load store
    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .eq("id", productData.store_id)
      .maybeSingle();
    
    setStore(storeData);
    
    // Load reviews
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq("product_id", id)
      .order("created_at", { ascending: false });
    
    setReviews(reviewsData || []);
    setLoading(false);
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
    
    try {
      const { error } = await supabase
        .from("reviews")
        .insert({
          product_id: id,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment,
        });
      
      if (error) throw error;
      
      toast({
        title: "شكراً لتقييمك!",
        description: "تم إضافة تقييمك بنجاح",
      });

      setNewReview({ rating: 5, comment: "" });
      loadProductData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة التقييم",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm" dir="rtl">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product || !store) {
    return (
      <div className="min-h-screen bg-gradient-warm" dir="rtl">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl">المنتج غير موجود</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      
      {/* Product Details */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image Gallery */}
            <div className="animate-fade-in">
              <ProductImageGallery 
                images={productImages}
                productName={product.name}
                discountPercentage={product.discount_price ? Math.round(((product.price - product.discount_price) / product.price) * 100) : undefined}
              />
            </div>

            {/* Product Info */}
            <div className="animate-fade-in space-y-6">
              <div>
                <Badge className="bg-gradient-primary text-primary-foreground font-bold mb-4 text-lg px-4 py-2">
                  {product.category || 'غير مصنف'}
                </Badge>
                
                <h1 className="text-5xl font-black text-charcoal mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-light fill-yellow-light" />
                    <span className="text-2xl font-bold text-charcoal">{product.rating || 0}</span>
                    <span className="text-charcoal-light">({product.reviews_count || 0} تقييم)</span>
                  </div>
                </div>
                
                <p className="text-xl text-charcoal-light leading-relaxed">
                  {product.description || 'لا يوجد وصف'}
                </p>
              </div>

              {/* Store Info */}
              <Link to={`/store/${store.id}`}>
                <Card className="bg-gradient-card hover:shadow-card transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary">
                  <CardContent className="p-6 flex items-center gap-4">
                    <img 
                      src={store.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'} 
                      alt={store.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Store className="w-5 h-5 text-primary" />
                        <span className="font-bold text-charcoal text-lg">{store.name}</span>
                        {store.verified && <ShieldCheck className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-charcoal-light">
                        <Star className="w-4 h-4 text-yellow-light fill-yellow-light" />
                        <span>{store.rating || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Price and Variants */}
              <Card className="bg-white shadow-soft border-2 border-primary/20">
                <CardContent className="p-8">
                  {/* اختيار المتغيرات */}
                  {variants.length > 0 && (
                    <div className="mb-6 space-y-4">
                      <h3 className="font-bold text-lg">اختر المواصفات</h3>
                      {Object.keys(variants[0].attributes).map((attrKey) => (
                        <div key={attrKey}>
                          <Label>{attrKey}</Label>
                          <Select 
                            value={selectedVariant?.attributes?.[attrKey] || ""}
                            onValueChange={(value) => {
                              const variant = variants.find(v => 
                                v.attributes[attrKey] === value
                              );
                              if (variant) setSelectedVariant(variant);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`اختر ${attrKey}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {[...new Set(variants.map(v => v.attributes[attrKey]))].map((value: string) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                      {selectedVariant && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>متوفر: {selectedVariant.quantity} قطعة</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-5xl font-black text-primary">
                      {selectedVariant ? selectedVariant.price : (product.discount_price || product.price)} ر.س
                    </div>
                    {!selectedVariant && product.discount_price && (
                      <div className="text-2xl text-charcoal-light line-through">
                        {product.price} ر.س
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4 mb-6">
                    <Button 
                      size="lg"
                      className="flex-1 bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full font-bold text-xl py-7"
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.discount_price || product.price,
                        image: product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                        category: product.category || 'غير مصنف',
                        storeName: store.name,
                        storeId: store.id
                      })}
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
                          addToWishlist({
                            id: product.id,
                            name: product.name,
                            price: product.discount_price || product.price,
                            image: product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                            category: product.category || 'غير مصنف',
                            storeName: store.name,
                            storeId: store.id
                          });
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
                  
                  {product.in_stock ? (
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
                        {review.profiles?.avatar_url && (
                          <img
                            src={review.profiles.avatar_url}
                            alt={review.profiles.full_name}
                            className="w-12 h-12 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold">{review.profiles?.full_name || 'مستخدم'}</span>
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

      {isMobile ? <MobileFooter /> : <Footer />}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ProductDetail;
