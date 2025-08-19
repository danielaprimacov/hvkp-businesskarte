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

      // on home: always show while over hero
      if (isHome && currentY <= heroBottom) {
        setShowNavbar(true);
      } else {
        // otherwise (either scrolled past hero on home, or any scroll on other pages)
        if (currentY > lastScrollY.current) {
          // scrolled down
          setShowNav(false);
        } else {
          // scrolled up
          setShowNav(true);
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <nav
      className={`fixed inset-x-0 h-14 z-50 px-5 ${
        showNav ? "top-0" : "-top-16"
      } transition-all duration-600 ease-out overflow-visible`}
    >
      <div className="w-full h-full flex items-center justify-between">
        <div>
          <img
            className="w-6 cursor-pointer"
            src={menuIcon}
            alt="Menu Burger"
          />
        </div>
        <Link to="/">
          <img className="w-24 cursor-pointer" src={logo} alt="Logo" />
        </Link>
        <Link to="/">
          <img
            className="w-6 cursor-pointer"
            src={AdminIcon}
            alt="Profile Icon"
          />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
