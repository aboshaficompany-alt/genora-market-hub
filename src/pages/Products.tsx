import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star, ShoppingCart, Store, Search, Heart, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/use-mobile";

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
  category: string | null;
  stores?: {
    name: string;
  };
}

const Products = () => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load products
    const { data: productsData } = await supabase
      .from("products")
      .select(`
        *,
        stores(name)
      `)
      .order("created_at", { ascending: false });

    if (productsData) {
      setProducts(productsData);
    }

    // Load categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("name_ar")
      .eq("is_active", true)
      .order("display_order");

    if (categoriesData) {
      setCategories(["all", ...categoriesData.map(c => c.name_ar)]);
    }

    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const productPrice = product.discount_price || product.price;
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      const matchesRating = (product.rating || 0) >= minRating;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-black text-charcoal mb-6">
              جميع <span className="bg-gradient-primary bg-clip-text text-transparent">المنتجات</span>
            </h1>
            <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
              تصفح آلاف المنتجات المميزة من أفضل المتاجر
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-2 sticky top-24 animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-charcoal">التصفية</h3>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <Label className="mb-2 block">البحث</Label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن منتج..."
                        className="pr-10"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <Label className="mb-2 block">الفئة</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الفئات</SelectItem>
                        {categories.filter(cat => cat !== "all").map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <Label className="mb-2 block">
                      نطاق السعر: {priceRange[0]} - {priceRange[1]} ر.س
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={5000}
                      step={50}
                      className="mt-4"
                    />
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-6">
                    <Label className="mb-2 block">التقييم الأدنى</Label>
                    <Select value={minRating.toString()} onValueChange={(val) => setMinRating(Number(val))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">الكل</SelectItem>
                        <SelectItem value="4">4 نجوم فأكثر</SelectItem>
                        <SelectItem value="4.5">4.5 نجوم فأكثر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <Label className="mb-2 block">الترتيب</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">افتراضي</SelectItem>
                        <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
                        <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
                        <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 text-charcoal-light animate-fade-in">
                تم العثور على {filteredProducts.length} منتج
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-glow transition-all duration-300 hover:scale-105 bg-white h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
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
                        <Badge className="bg-red-500 text-white font-bold shadow-card text-lg px-3 py-1">
                          -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                        </Badge>
                      </div>
                    )}
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">غير متوفر</span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-sm text-charcoal-light">
                      <Store className="w-4 h-4" />
                      <span>{product.stores?.name || "متجر"}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-charcoal-light mb-4 line-clamp-2 text-sm flex-1">
                      {product.description || "لا يوجد وصف"}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Star className="w-4 h-4 text-yellow-light fill-yellow-light" />
                      <span className="font-bold text-charcoal">{product.rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-charcoal-light">({product.reviews_count || 0} تقييم)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black text-primary">
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
                          className="bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full flex-1"
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
            </div>
          </div>
        </div>
      </section>

      {isMobile ? <MobileFooter /> : <Footer />}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Products;
