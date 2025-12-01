import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useLiveUpdate } from "@/hooks/useLiveUpdate";
import Index from "./pages/Index";
import Stores from "./pages/Stores";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import StoreDetail from "./pages/StoreDetail";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import VendorDashboard from "./pages/VendorDashboard";
import VendorRegistration from "./pages/VendorRegistration";
import VendorProducts from "./pages/VendorProducts";
import VendorOrders from "./pages/VendorOrders";
import StoreSettings from "./pages/StoreSettings";
import AdminDashboard from "./pages/AdminDashboard";
import OrderHistory from "./pages/OrderHistory";
import ShippingCompanies from "./pages/ShippingCompanies";
import WithdrawalRequests from "./pages/WithdrawalRequests";
import Debts from "./pages/Debts";
import Banners from "./pages/Banners";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import StoreCategories from "./pages/StoreCategories";
import Messages from "./pages/Messages";
import Offers from "./pages/Offers";
import PromoCodes from "./pages/PromoCodes";
import Cities from "./pages/Cities";
import MerchantServices from "./pages/MerchantServices";
import AccountingOperations from "./pages/AccountingOperations";
import Branches from "./pages/Branches";
import ServiceSubscriptions from "./pages/ServiceSubscriptions";
import Advertisements from "./pages/Advertisements";
import AllProducts from "./pages/AllProducts";
import AllOrders from "./pages/AllOrders";
import Promotions from "./pages/Promotions";
import Install from "./pages/Install";
import Profile from "./pages/Profile";
import PaymentMethods from "./pages/PaymentMethods";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Enable live updates for mobile app
  useLiveUpdate();

  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/store/:id" element={<StoreDetail />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/vendor-registration" element={<VendorRegistration />} />
                <Route path="/vendor-products" element={<VendorProducts />} />
                <Route path="/vendor-orders" element={<VendorOrders />} />
                <Route path="/store-settings" element={<StoreSettings />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/shipping-companies" element={<ShippingCompanies />} />
                <Route path="/withdrawal-requests" element={<WithdrawalRequests />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/banners" element={<Banners />} />
                <Route path="/users" element={<Users />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/store-categories" element={<StoreCategories />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/promo-codes" element={<PromoCodes />} />
                <Route path="/cities" element={<Cities />} />
                <Route path="/merchant-services" element={<MerchantServices />} />
                <Route path="/accounting-operations" element={<AccountingOperations />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/service-subscriptions" element={<ServiceSubscriptions />} />
                <Route path="/advertisements" element={<Advertisements />} />
                <Route path="/all-products" element={<AllProducts />} />
                <Route path="/all-orders" element={<AllOrders />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/install" element={<Install />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
