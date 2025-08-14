import ContactUs from "../components/ContactUs";
import CraneManufacturer from "../components/CraneManufacturer";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";

function HomePage() {
  return (
    <div className="">
      <HeroSection />
      <CraneManufacturer />
      <Services />
      <ContactUs />
    </div>
  );
}

export default HomePage;
