import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Categories from "@/components/Categories";
import FeaturedStores from "@/components/FeaturedStores";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProcessTimeline from "@/components/ProcessTimeline";
import PaymentMethods from "@/components/PaymentMethods";
import RegistrationCTA from "@/components/RegistrationCTA";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import { InstallPrompt } from "@/components/InstallPrompt";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen" dir="rtl">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <Hero />
      <Benefits />
      <Categories />
      <FeaturedStores />
      <FeaturedProducts />
      <ProcessTimeline />
      <PaymentMethods />
      <RegistrationCTA />
      {isMobile ? <MobileFooter /> : <Footer />}
      {isMobile && <MobileBottomNav />}
      <InstallPrompt />
    </div>
  );
};

export default Index;
