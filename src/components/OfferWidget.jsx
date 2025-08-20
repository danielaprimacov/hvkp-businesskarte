import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Modal from "./ui/Modal";
import OfferForm from "./OfferForm";

const TRIGGER_OFFSET = 48; // how far below the hero the reveal should trigger

function OfferWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const { pathname } = useLocation();

  useEffect(() => {
    // on all other pages visible
    if (pathname !== "/") {
      setVisible(true);
      return;
    }

    const sentinel = document.getElementById("hero-after");
    // If there's no sentinel, don't hide
    if (!sentinel) {
      setVisible(true);
      return;
    }

    const update = () => {
      // Threshold: when the bottom of the viewport crosses the line slightly below the hero
      const rectTop = sentinel.getBoundingClientRect().top; // relative to the top of the viewport
      const triggerLine = window.innerHeight - TRIGGER_OFFSET; // "viewport bottom minus offset"
      setVisible(rectTop <= triggerLine); // below threshold => show; above => hide
    };

    // the initial state
    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <>
      <div
        className={`fixed z-[1200] right-3 sm:right-4 md:right-5 bottom-3 sm:bottom-5 md:bottom-10 px-1.5 sm:px-2 rounded-full shadow-lg bg-red-600/40 hover:bg-red-600 text-white flex items-center transition-opacity duration-200 sm:duration-300 ease-in${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-hidden={!visible}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base font-medium cursor-pointer rounded-full focus:outline-none focus-visible:ring focus-visible:ring-white/60"
        >
          Angebot anfordern
        </button>
      </div>

      {/* The modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <OfferForm onClose={() => setIsOpen(false)} variant="general" />
      </Modal>
    </>
  );
}

export default OfferWidget;
