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

  const location = useLocation();
  const isHome = location.pathname === "/";

  const lastScrollY = useRef(0);

  const { authed } = useAuth();
  const adminPath = authed ? "/admin" : "/admin/login";

  useEffect(() => {
    if (menuOpen) closeMenu(); // guard inside closeMenu prevents the bug
  }, [location.pathname]);

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
    if (!menuOpen) return; // do nothing if already closed
    setClosing(true); // tell icon to stay as ✕ until exit finishes
    setMenuOpen(false);
  };

  // Keep the close icon visible while exiting
  const iconShowsClose = menuOpen || closing;

  // framer variants
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
  ];

  return (
    <>
      <nav
        className={`fixed inset-x-0 h-14 z-50 pt-6 px-6 sm:px-6 ${
          showNav ? "top-0" : "-top-16"
        } transition-all duration-500 ease-out overflow-visible`}
      >
        <div className="w-full h-full flex items-center justify-between">
          <div>
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
          </div>

          <Link to="/" onClick={menuOpen ? closeMenu : undefined}>
            <img
              className="w-24 sm:w-24 cursor-pointer"
              src={logo}
              alt="Logo"
            />
          </Link>

          <Link to={adminPath} onClick={menuOpen ? closeMenu : undefined}>
            <img
              className="w-6 sm:w-7 cursor-pointer"
              src={AdminIcon}
              alt="Profile Icon"
            />
          </Link>
        </div>
      </nav>

      {/* Drawer + Backdrop with exit callback to clear "closing" */}
      <AnimatePresence onExitComplete={() => setClosing(false)}>
        {menuOpen && (
          <>
            {/* Backdrop */}
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

            {/* Drawer */}
            <motion.aside
              key="drawer"
              className="fixed top-0 left-0 h-full w-[18rem] bg-white shadow-lg z-[2010] p-6 overflow-auto"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* inner close */}
              <button
                onClick={closeMenu}
                className="absolute top-4 right-4 p-1 cursor-pointer"
                aria-label="Menü schließen"
              >
                <img src={crossIcon} alt="Menü schließen" className="w-5 h-5" />
              </button>

              {/* Links with staggered reveal */}
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
                    className="block text-lg font-medium hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 rounded"
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
