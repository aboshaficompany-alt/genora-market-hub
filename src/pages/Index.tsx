import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Categories from "@/components/Categories";
import FeaturedStores from "@/components/FeaturedStores";
import ProcessTimeline from "@/components/ProcessTimeline";
import PaymentMethods from "@/components/PaymentMethods";
import RegistrationCTA from "@/components/RegistrationCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />
      <Hero />
      <Benefits />
      <Categories />
      <FeaturedStores />
      <ProcessTimeline />
      <PaymentMethods />
      <RegistrationCTA />
      <Footer />
    </div>
  );
};

export default Index;
