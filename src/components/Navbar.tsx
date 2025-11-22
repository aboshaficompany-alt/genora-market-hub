import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, ShoppingBag, Home, User, Menu, ShoppingCart, Heart, LogOut } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-soft border-b border-border/30" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Store className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-3xl font-black bg-gradient-primary bg-clip-text text-transparent" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Geenora
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-charcoal hover:text-primary transition-colors font-semibold flex items-center gap-2">
              <Home className="w-5 h-5" />
              الرئيسية
            </Link>
            <Link to="/stores" className="text-charcoal hover:text-primary transition-colors font-semibold flex items-center gap-2">
              <Store className="w-5 h-5" />
              المتاجر
            </Link>
            <Link to="/products" className="text-charcoal hover:text-primary transition-colors font-semibold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              المنتجات
            </Link>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -left-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -left-1 w-5 h-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/orders">
                  <Button variant="ghost">طلباتي</Button>
                </Link>
                <Link to="/vendor-dashboard">
                  <Button variant="ghost">لوحة التاجر</Button>
                </Link>
                <Button onClick={signOut} variant="ghost" className="text-red-500">
                  <LogOut className="w-5 h-5 ml-2" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full font-bold">
                    <User className="w-5 h-5 ml-2" />
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/vendor-registration">
                  <Button variant="outline" className="rounded-full font-bold">
                    تسجيل كتاجر
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-charcoal hover:text-primary transition-colors"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4">
            <Link 
              to="/" 
              className="block text-charcoal hover:text-primary transition-colors font-semibold py-2 flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-5 h-5" />
              الرئيسية
            </Link>
            <Link 
              to="/stores" 
              className="block text-charcoal hover:text-primary transition-colors font-semibold py-2 flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Store className="w-5 h-5" />
              المتاجر
            </Link>
            <Link 
              to="/products" 
              className="block text-charcoal hover:text-primary transition-colors font-semibold py-2 flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="w-5 h-5" />
              المنتجات
            </Link>
            <Button className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full font-bold">
              <User className="w-5 h-5 ml-2" />
              تسجيل الدخول
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
