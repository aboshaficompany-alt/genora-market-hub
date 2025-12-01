import { Link } from "react-router-dom";
import { Store, ShoppingCart, Heart, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, signOut, hasRole } = useAuth();
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        const vendorRole = await hasRole("vendor");
        setIsVendor(vendorRole);
      }
    };
    checkRole();
  }, [user, hasRole]);

  return (
    <>
      {/* Top Bar - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border/20 shadow-sm" dir="rtl">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black bg-gradient-primary bg-clip-text text-transparent">
              Geenora
            </span>
            <Store className="w-6 h-6 text-primary" />
          </Link>

          {/* Cart & Wishlist */}
          <div className="flex items-center gap-2">
            <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <Heart className="w-5 h-5 text-foreground" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {wishlistItems.length}
                </Badge>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-64 bg-background border-l border-border shadow-xl transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-8 h-8 text-primary" />
              <span className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent">
                Geenora
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-foreground font-semibold"
            >
              الرئيسية
            </Link>
            <Link
              to="/stores"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-foreground font-semibold"
            >
              المتاجر
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-foreground font-semibold"
            >
              المنتجات
            </Link>
            <Link
              to="/orders"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-foreground font-semibold"
            >
              طلباتي
            </Link>
          </nav>

          {/* Menu Footer */}
          <div className="p-4 border-t border-border space-y-2">
            {user ? (
              <>
                {isVendor && (
                  <Link to="/vendor-dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <LayoutDashboard className="ml-2 w-5 h-5" />
                      لوحة التاجر
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={async () => {
                    await signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="ml-2 w-5 h-5" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-primary text-primary-foreground">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/vendor-registration" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    تسجيل كتاجر
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
