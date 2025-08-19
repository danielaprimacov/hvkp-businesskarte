import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import OfferWidget from "../OfferWidget";

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-dvh">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <OfferWidget />
    </div>
  );
}

export default PublicLayout;
