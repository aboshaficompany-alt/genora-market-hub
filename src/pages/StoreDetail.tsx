import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, ShoppingCart, Heart, Facebook, Instagram, Twitter, Globe, Store, Send } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export default function StoreDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [store, setStore] = useState<any>(null);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [storeReviews, setStoreReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState<any>(null);

  useEffect(() => {
    loadStoreData();
  }, [id]);

  const loadStoreData = async () => {
    if (!id) return;
    
    // Load store
    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .eq("id", id)
      .single();

    setStore(storeData);

    // Load products
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", id);

    setStoreProducts(productsData || []);

    // Load reviews
    const { data: reviewsData } = await supabase
      .from("store_reviews")
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq("store_id", id)
      .order("created_at", { ascending: false });

    setStoreReviews(reviewsData || []);

    // Check if user has already reviewed
    if (user) {
      const { data: existingReview } = await supabase
        .from("store_reviews")
        .select("*")
        .eq("store_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      
      setUserReview(existingReview);
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment || "");
      }
    }

    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يجب عليك تسجيل الدخول لإضافة تقييم",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReview(true);

    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from("store_reviews")
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userReview.id);

        if (error) throw error;

        toast({
          title: "تم التحديث",
          description: "تم تحديث تقييمك بنجاح",
        });
      } else {
        // Insert new review
        const { error } = await supabase
          .from("store_reviews")
          .insert({
            store_id: id,
            user_id: user.id,
            rating,
            comment,
          });

        if (error) throw error;

        toast({
          title: "تم الإضافة",
          description: "تم إضافة تقييمك بنجاح",
        });
      }

      // Reload reviews
      loadStoreData();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة التقييم",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl">جاري التحميل...</p>
        </main>
        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl">المتجر غير موجود</p>
        </main>
        {isMobile ? <MobileFooter /> : <Footer />}
        {isMobile && <MobileBottomNav />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <main className="flex-1 container mx-auto px-4 py-24">
        {/* Store Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {store.image_url && (
                <img
                  src={store.image_url}
                  alt={store.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div className="md:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{store.rating || 0}</span>
                      {store.verified && (
                        <Badge className="bg-green-500">موثق</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">{store.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Store Category */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      التصنيف
                    </h3>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {store.category}
                    </Badge>
                  </div>

                  {/* Shipping Method */}
                  {store.shipping_method && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg">طريقة الشحن</h3>
                      <Badge className="bg-gradient-primary text-base px-4 py-2">
                        {store.shipping_method === "vendor"
                          ? "🚚 الشحن بواسطة التاجر"
                          : "📦 الشحن عبر شركة الشحن"}
                      </Badge>
                    </div>
                  )}
                </div>
                  
                {/* Store Contact Info */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    معلومات التواصل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {store.phone && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xl">📱</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">الهاتف</p>
                          <p className="font-semibold">{store.phone}</p>
                        </div>
                      </div>
                    )}
                    {store.email && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xl">✉️</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                          <p className="font-semibold text-sm">{store.email}</p>
                        </div>
                      </div>
                    )}
                    {store.city && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">المدينة</p>
                          <p className="font-semibold">{store.city}</p>
                        </div>
                      </div>
                    )}
                    {store.store_url && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">رابط المتجر</p>
                          <a 
                            href={store.store_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-primary hover:underline text-sm"
                          >
                            زيارة الموقع
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Social Media Links */}
                  {store.social_media && Object.keys(store.social_media).filter(key => store.social_media[key]).length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-xl">🌐</span>
                        تابعنا على وسائل التواصل
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {store.social_media.facebook && (
                          <a 
                            href={store.social_media.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
                          >
                            <Facebook className="h-5 w-5 text-[#1877F2]" />
                            <span className="font-semibold text-sm">Facebook</span>
                          </a>
                        )}
                        {store.social_media.instagram && (
                          <a 
                            href={store.social_media.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
                          >
                            <Instagram className="h-5 w-5 text-[#E4405F]" />
                            <span className="font-semibold text-sm">Instagram</span>
                          </a>
                        )}
                        {store.social_media.twitter && (
                          <a 
                            href={store.social_media.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
                          >
                            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                            <span className="font-semibold text-sm">Twitter</span>
                          </a>
                        )}
                        {store.social_media.website && (
                          <a 
                            href={store.social_media.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
                          >
                            <Globe className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-sm">الموقع الإلكتروني</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="h-7 w-7 text-yellow-400 fill-yellow-400" />
            تقييمات المتجر
          </h2>

          {/* Add/Edit Review Form */}
          {user && (
            <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">
                  {userReview ? "تعديل تقييمك" : "أضف تقييمك"}
                </h3>
                
                {/* Rating Stars */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-semibold">التقييم:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <Textarea
                  placeholder="اكتب تعليقك هنا (اختياري)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-4 min-h-[100px]"
                />

                <Button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="bg-gradient-primary"
                >
                  <Send className="ml-2 h-4 w-4" />
                  {submittingReview ? "جاري الإرسال..." : userReview ? "تحديث التقييم" : "إرسال التقييم"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {storeReviews.length > 0 ? (
              storeReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {review.profiles?.avatar_url ? (
                          <img
                            src={review.profiles.avatar_url}
                            alt={review.profiles.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xl font-bold text-primary">
                              {review.profiles?.full_name?.[0] || "؟"}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold">
                            {review.profiles?.full_name || "مستخدم"}
                          </p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    لا توجد تقييمات حتى الآن. كن أول من يقيم هذا المتجر!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Store Products */}
        <h2 className="text-2xl font-bold mb-6">منتجات المتجر</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">
                    {product.rating || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews_count || 0})
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-primary">
                    {product.discount_price || product.price} ر.س
                  </span>
                  {product.discount_price && (
                    <span className="text-sm line-through text-muted-foreground">
                      {product.price} ر.س
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-primary"
                    onClick={() => {
                      addToCart(product);
                      toast({
                        title: "تمت الإضافة",
                        description: "تم إضافة المنتج إلى السلة",
                      });
                    }}
                  >
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    أضف للسلة
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      addToWishlist(product);
                      toast({
                        title: "تمت الإضافة",
                        description: "تم إضافة المنتج للمفضلة",
                      });
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {isMobile ? <MobileFooter /> : <Footer />}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}
