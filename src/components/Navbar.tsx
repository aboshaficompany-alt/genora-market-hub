import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, Home, User, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-soft border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Store className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-3xl font-black bg-gradient-primary bg-clip-text text-transparent">
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
            <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow rounded-full font-bold">
              <User className="w-5 h-5 ml-2" />
              تسجيل الدخول
            </Button>
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
