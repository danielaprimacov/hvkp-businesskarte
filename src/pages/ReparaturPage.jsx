import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import Modal from "../components/ui/Modal";
import OfferForm from "../components/OfferForm";

import reparaturBackground from "../assets/images/reparatur.jpg";
import arrowDownIcon from "../assets/icons/arrow-circle-down-reparatur.png";
import arrowsIcon from "../assets/icons/angle-double-small-right.png";

function ReparaturPage() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <>
      <div ref={containerRef} className="relative">
        <section ref={sectionRef} className="relative h-screen overflow-hidden">
          <motion.img
            style={{ opacity: imgOpacity, y: imgY }}
            className="absolute inset-0 h-full w-full object-cover"
            src={reparaturBackground}
            alt="Transport Background Image"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 h-full flex items-center">
            <motion.div style={{ opacity: textOpacity }} className="text-white">
              <h1 className="text-7xl font-semibold tracking-wider">
                Reparatur & Ersatzteile
              </h1>
              <p className="mt-4 text-lg text-blue-50 bg-black/60 px-10 py-3 rounded">
                Fehlersuche, Reparatur und Service sowie Ersatzteilbeschaffung
                und Funktionsprüfung.
              </p>
            </motion.div>
          </div>
          <a
            href="#transport-info"
            aria-label="Scroll down"
            className="group absolute left-1/2 -translate-x-1/2 bottom-6 z-20 inline-flex h-20 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition"
          >
            <motion.img
              src={arrowDownIcon}
              className="w-12 opacity-90 group-hover:opacity-100"
              alt="Arrow Down Icon"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </a>
        </section>
        <section className="mt-40 pt-10 mb-20" id="transport-info">
          <div className="flex flex-col justify-center items-center">
            <p className="w-[60rem] mb-10 text-3xl/13 uppercase font-bold text-center">
              Wir übernehmen Diagnose, Reparatur und Ersatzteilbeschaffung –
              schnell und zuverlässig.
            </p>
            <p className="w-[70rem] mb-10 text-center text-xl">
              Für ein schnelles Angebot senden Sie uns Kranmodell/Typ,
              Seriennummer, Fehlerbild (kurze Beschreibung/Fotos), Standort
              sowie Ihr Zeitfenster – wir melden uns kurzfristig mit einem
              Festpreis.
            </p>

            <button
              onClick={() => setIsOpen(true)}
              className="mt-5 px-6 py-2 flex gap-3 rounded-md text-white text-xl tracking-wider uppercase bg-[#4d898a] transition duration-300 hover:scale-110 ease-in cursor-pointer"
            >
              Angebot anfordern
              <img
                src={arrowsIcon}
                className="w-6 pt-1"
                alt="Double arrow icon"
              />
            </button>
          </div>
        </section>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <OfferForm onClose={() => setIsOpen(false)} variant="repair" />
      </Modal>
    </>
  );
}

export default ReparaturPage;
