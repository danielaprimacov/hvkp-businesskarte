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
        className={`px-2 fixed bottom-10 right-5 z-[1200] flex items-center bg-red-600/40 text-white rounded-full shadow-lg hover:bg-red-600 transition-opacity duration-300 ease-in ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!visible}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-sm font-medium cursor-pointer"
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
