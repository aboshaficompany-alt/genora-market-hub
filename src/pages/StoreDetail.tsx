import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ShoppingCart, Heart, Facebook, Instagram, Twitter, Globe } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";

export default function StoreDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { toast } = useToast();
  const [store, setStore] = useState<any>(null);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl">جاري التحميل...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl">المتجر غير موجود</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

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
                
                <p className="text-muted-foreground mb-4">{store.description}</p>

                <div className="space-y-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {store.category}
                  </Badge>
                  
                  {/* Store Contact Info */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-bold text-lg mb-3">معلومات التواصل</h3>
                    <div className="space-y-2 text-sm">
                      {store.phone && (
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">الهاتف:</span> {store.phone}
                        </p>
                      )}
                      {store.email && (
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">البريد:</span> {store.email}
                        </p>
                      )}
                      {store.city && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {store.city}
                        </p>
                      )}
                      {store.shipping_method && (
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">الشحن:</span>{" "}
                          {store.shipping_method === "vendor"
                            ? "بواسطة التاجر"
                            : "شركة الشحن"}
                        </p>
                      )}
                    </div>
                    
                    {/* Social Media Links */}
                    {store.social_media && Object.keys(store.social_media).length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">تابعنا على:</h4>
                        <div className="flex gap-3">
                          {store.social_media.facebook && (
                            <a 
                              href={store.social_media.facebook} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <Facebook className="h-5 w-5" />
                            </a>
                          )}
                          {store.social_media.instagram && (
                            <a 
                              href={store.social_media.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                          {store.social_media.twitter && (
                            <a 
                              href={store.social_media.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <Twitter className="h-5 w-5" />
                            </a>
                          )}
                          {store.social_media.website && (
                            <a 
                              href={store.social_media.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <Globe className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

      <Footer />
    </div>
  );
}
