import ContactUs from "../components/ContactUs";
import CraneManufacturer from "../components/CraneManufacturer";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";

function HomePage() {
  return (
    <>
      <HeroSection />
      <CraneManufacturer />
      <Services />
      <ContactUs />
    </>
  );
}

export default HomePage;
