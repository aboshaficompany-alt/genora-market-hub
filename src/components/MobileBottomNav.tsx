import { Link, useLocation } from "react-router-dom";
import { Home, Store, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: Store, label: "المتاجر", path: "/stores" },
    { icon: ShoppingBag, label: "المنتجات", path: "/products" },
    { icon: User, label: "حسابي", path: "/auth" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border/20 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-safe" dir="rtl">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all duration-300",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center transition-all duration-300",
                  isActive && "scale-110"
                )}
              >
                <Icon className="w-6 h-6" />
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
                )}
              </div>
              <span className="text-xs font-semibold">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-gradient-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
