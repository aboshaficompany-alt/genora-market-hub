import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  storeName?: string;
}

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string | number) => void;
  isInWishlist: (productId: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { toast } = useToast();

  const addToWishlist = (product: Product) => {
    setItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        toast({
          title: "موجود مسبقاً",
          description: "المنتج موجود في المفضلة",
        });
        return prev;
      }
      toast({
        title: "تمت الإضافة للمفضلة",
        description: `تم إضافة ${product.name} إلى المفضلة`,
      });
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    toast({
      title: "تم الحذف",
      description: "تم حذف المنتج من المفضلة",
    });
  };

  const isInWishlist = (productId: string | number) => {
    return items.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
