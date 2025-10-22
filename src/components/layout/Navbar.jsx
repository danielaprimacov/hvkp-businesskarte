import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useAuth } from "../../content/auth";

import AdminIcon from "../../assets/icons/circle-user.png";
import logo from "../../assets/images/logo.svg";
import menuIcon from "../../assets/icons/menu-burger.png";
import crossIcon from "../../assets/icons/cross.png";

function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false); // keep ✕ until exit completes

  const prefersReduced = useReducedMotion();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const lastY = useRef(0);
  const ticking = useRef(false);
  const overHeroRef = useRef(false);
  const [overHero, _setOverHero] = useState(false); // state for rendering

  const setOverHero = (v) => {
    overHeroRef.current = v;
    _setOverHero(v);
  };

  const { authed } = useAuth();
  const adminPath = authed ? "/admin" : "/admin/login";

  // close drawer on route change + ensure nav visible initially
  useEffect(() => {
    if (menuOpen) closeMenu();
    setShowNav(true);
    // reset lastY baseline so direction logic starts clean
    lastY.current = Math.max(0, window.scrollY || window.pageYOffset || 0);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  const openMenu = () => {
    setClosing(false);
    setMenuOpen(true);
  };
  const closeMenu = () => {
    if (!menuOpen) return;
    setClosing(true);
    setMenuOpen(false);
  };
  const iconShowsClose = menuOpen || closing;

  // Compute “over the hero?” robustly each frame
  const computeOverHero = () => {
    // prefer an explicit hero element
    const heroEl = document.getElementById("home-hero");
    if (heroEl) {
      const bottom = heroEl.getBoundingClientRect().bottom;
      return bottom > 1; // still overlapping the viewport
    }
    // else try a sentinel placed right AFTER the hero
    const sentinel = document.getElementById("hero-after");
    if (sentinel) {
      const top = sentinel.getBoundingClientRect().top;
      return top > 1; // sentinel still below the top edge => we’re over the hero
    }
    // fallback: assume hero is ~1 viewport tall
    const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
    return y < window.innerHeight - 1;
  };

  // Hide-on-down / show-on-up, but pin visible while over hero (home only)
  useEffect(() => {
    const DELTA = 6;     // ignore tiny jitter
    const TOP_LOCK = 8;  // always show near top to avoid iOS bounce flicker

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        ticking.current = false;

        if (menuOpen) return; // keep visible while drawer open

        const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
        const overHero = isHome && computeOverHero();

        if (overHero) {
          // While over the hero on home, nav stays visible
          setShowNav(true);
          lastY.current = y;
          return;
        }

        // Below hero (or not on home): hide on down, show on up
        if (y <= TOP_LOCK) {
          setShowNav(true);
        } else if (y - lastY.current > DELTA) {
          // scrolling down
          setShowNav(false);
        } else if (lastY.current - y > DELTA) {
          // scrolling up
          setShowNav(true);
        }

        lastY.current = y;
      });
    };

    // initialize baseline + run once
    lastY.current = Math.max(0, window.scrollY || window.pageYOffset || 0);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true }); // helps iOS
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchmove", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome, menuOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Anim params
  const EASING = prefersReduced ? "linear" : [0.22, 1, 0.36, 1];
  const durIn = prefersReduced ? 0 : 0.25;
  const durOut = prefersReduced ? 0 : 0.22;

  const drawerVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: {
        type: "tween",
        ease: EASING,
        duration: durIn,
        when: "beforeChildren",
        staggerChildren: prefersReduced ? 0 : 0.04,
      },
    },
    exit: { x: "-100%", transition: { ease: EASING, duration: durOut } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.18 } },
  };

  const links = [{ to: "/", label: "Startseite" }];
  const serviceLinks = [
    { to: "/transport", label: "Krantransporte" },
    { to: "/de-montage", label: "Montage & Demontage" },
    { to: "/reparatur", label: "Reparatur & Ersatzteile" },
    { to: "/wiederkehrende-pruefung", label: "Wiederkehrende Prüfung" },
  ];

  return (
    <>
      <nav
        className={`fixed inset-x-0 h-14 z-50 pt-6 px-6 sm:px-6 ${
          showNav ? "top-0" : "-top-16"
        } transition-all duration-500 ease-out overflow-visible`}
      >
        <div className="w-full h-full flex items-center justify-between">
          {/* Menu button */}
          <button
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
            aria-label={iconShowsClose ? "Menü schließen" : "Menü öffnen"}
            className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
          >
            <AnimatePresence initial={false} mode="wait">
              {iconShowsClose ? (
                <motion.img
                  key="close"
                  src={crossIcon}
                  alt="Menü schließen"
                  initial={{ opacity: 0, rotate: -90, scale: 0.9 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.9 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="w-full h-full"
                />
              ) : (
                <motion.img
                  key="open"
                  src={menuIcon}
                  alt="Menü öffnen"
                  initial={{ opacity: 0, rotate: 90, scale: 0.9 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.9 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="w-full h-full"
                />
              )}
            </AnimatePresence>
          </button>

          {/* Logo */}
          <Link to="/" onClick={menuOpen ? closeMenu : undefined}>
            <img className="w-24 sm:w-24 cursor-pointer" src={logo} alt="Logo" />
          </Link>

          {/* Admin/Profile */}
          <Link to={adminPath} onClick={menuOpen ? closeMenu : undefined}>
            <img className="w-6 sm:w-7 cursor-pointer" src={AdminIcon} alt="Profil" />
          </Link>
        </div>
      </nav>

      {/* Drawer + Backdrop */}
      <AnimatePresence onExitComplete={() => setClosing(false)}>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[2000]"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: durIn }}
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              className="fixed top-0 left-0 h-full w-[18rem] bg-white shadow-lg z-[2010] p-6 overflow-auto"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                onClick={closeMenu}
                className="absolute top-4 right-4 p-1 cursor-pointer"
                aria-label="Menü schließen"
              >
                <img src={crossIcon} alt="Menü schließen" className="w-5 h-5" />
              </button>

              <motion.nav
                className="mt-8 space-y-2"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.ul className="space-y-2">
                  {links.map((l) => (
                    <motion.li key={l.to} variants={itemVariants}>
                      <Link
                        to={l.to}
                        onClick={closeMenu}
                        className="block text-2xl font-medium hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 rounded"
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div variants={itemVariants}>
                  <p className="text-2xl font-medium mb-2">Unsere Leistungen</p>
                  <ul className="pl-4 space-y-1">
                    {serviceLinks.map((l) => (
                      <motion.li key={l.to} variants={itemVariants}>
                        <Link
                          to={l.to}
                          onClick={closeMenu}
                          className="block text-lg hover:translate-x-1 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 rounded"
                        >
                          {l.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link
                    to="/kontakt"
                    onClick={closeMenu}
                    className="block text-2xl font-medium hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 rounded"
                  >
                    Kontakt
                  </Link>
                </motion.div>
              </motion.nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
