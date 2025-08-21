import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import AdminIcon from "../../assets/icons/circle-user.png";
import logo from "../../assets/images/logo.svg";
import menuIcon from "../../assets/icons/menu-burger.png";

function Navbar() {
  const [showNav, setShowNav] = useState(true);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const heroBottom = window.innerHeight; // height of the hero on home
      const DELTA = 6; // ignore tiny scroll jitter (iOS bounce)
      const TOP_LOCK = 8; // always show when very top is reached

      // on home: always show while over hero
      if (isHome && currentY <= heroBottom) {
        setShowNav(true);
      } else {
        // Elsewhere (or below hero on home): hide on scroll down, show on scroll up
        if (currentY <= TOP_LOCK) {
          // At the very top: always show (prevents disappearing on iOS overscroll)
          setShowNav(true);
        } else if (currentY - lastScrollY.current > DELTA) {
          // Scrolling down noticeably
          setShowNav(false);
        } else if (lastScrollY.current - currentY > DELTA) {
          // Scrolling up noticeably
          setShowNav(true);
        }
      }

      lastScrollY.current = currentY;
    };

    // Set initial state correctly on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <nav
      className={`fixed inset-x-0 h-14 z-50 pt-[env(safe-area-inset-top)] px-3 sm:px-5 ${
        showNav ? "top-0" : "-top-16"
      } transition-all duration-500 ease-out overflow-visible`}
    >
      <div className="w-full h-full flex items-center justify-between">
        <div>
          <img
            className="w-6 sm:w-7 cursor-pointer"
            src={menuIcon}
            alt="Menu Burger"
          />
        </div>
        <Link to="/">
          <img className="w-24 sm:w-24 cursor-pointer" src={logo} alt="Logo" />
        </Link>
        <Link to="/">
          <img
            className="w-6 sm:w-7 cursor-pointer"
            src={AdminIcon}
            alt="Profile Icon"
          />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
