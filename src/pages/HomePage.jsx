import ContactUs from "../components/ContactUs";
import Bildergalerie from "../components/Bildergalerie";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";

function HomePage() {
  return (
    <>
      <HeroSection />
      <Bildergalerie />
      <Services />
      <ContactUs />
    </>
  );
}

export default HomePage;
