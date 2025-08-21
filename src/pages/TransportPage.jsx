import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

import Modal from "../components/ui/Modal";
import OfferForm from "../components/OfferForm";

import transportBackground from "../assets/images/transport-image.avif";
import arrowDownIcon from "../assets/icons/arrow-circle-down.png";
import arrowsIcon from "../assets/icons/angle-double-small-right.png";
import questionIcon from "../assets/icons/interrogation.png";

function TransportPage() {
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
        <section
          ref={sectionRef}
          className="relative h-screen h-[100dvh] h-[100svh] md:h-screen overflow-hidden"
        >
          <motion.img
            style={{ opacity: imgOpacity, y: imgY }}
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            src={transportBackground}
            alt="Transport Background Image"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 bg-gradient-to-b from-transparent to-white" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 h-full flex items-center">
            <motion.div style={{ opacity: textOpacity }} className="text-white">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-wider">
                Krantransporte
              </h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-blue-50 bg-black/60 px-4 sm:px-8 md:px-10 py-2 sm:py-3 rounded">
                Planung, Genehmigungen sowie Transportbegleitung und
                Absicherung.
              </p>
            </motion.div>
          </div>
          <a
            href="#transport-info"
            aria-label="Scroll down"
            className="group absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 z-20 inline-flex h-14 w-10 sm:h-20 sm:w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition"
          >
            <motion.img
              src={arrowDownIcon}
              className="w-8 sm:w-12 opacity-90 group-hover:opacity-100"
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
        <section
          className="mt-16 sm:mt-24 md:mt-40 pt-6 md:pt-10 mb-12 md:mb-20 scroll-mt-20 sm:scroll-mt-24"
          id="transport-info"
        >
          <div className="flex flex-col justify-center items-center px-4">
            <p className="w-full max-w-3xl sm:max-w-4xl md:max-w-[60rem] mb-6 sm:mb-8 md:mb-10 text-2xl sm:text-3xl md:text-3xl/13 uppercase font-bold text-center">
              Wir übernehmen Planung, Ausnahmegenehmigungen und Begleitfahrzeuge
              für Ihren Krantransport.
            </p>
            <p className="w-full max-w-4xl md:max-w-[70rem] mb-8 sm:mb-10 text-center text-base sm:text-lg md:text-xl px-1">
              Für ein schnelles Angebot senden Sie uns Maße/Gewichte der
              Komponenten, Abhol- und Zieladresse sowie Ihr Zeitfenster &ndash;
              wir melden uns kurzfristig mit einem Festpreis.
            </p>

            <button
              onClick={() => setIsOpen(true)}
              className="mt-2 sm:mt-3 md:mt-5 px-5 sm:px-6 py-2 flex gap-2 sm:gap-3 rounded-md text-white text-base sm:text-lg md:text-xl tracking-wider uppercase bg-blue-400 transition duration-300 hover:scale-110 ease-in cursor-pointer"
            >
              Angebot anfordern
              <img
                src={arrowsIcon}
                className="w-5 sm:w-6 pt-0.5 sm:pt-1"
                alt="Double arrow icon"
              />
            </button>
          </div>
          <div className="mt-12 sm:mt-16 md:mt-20 mx-4 md:mx-20 lg:mx-40 px-3 sm:px-4 py-5 flex flex-col items-center border border-blue-400 rounded-lg">
            <div className="flex items-center gap-3 sm:gap-5">
              <img
                src={questionIcon}
                alt="Question Icon"
                className="w-6 sm:w-7 md:w-auto"
              />
              <p className="text-lg sm:text-xl text-blue-400">
                Benötigen Sie zusätzlich die (De-)Montage?
              </p>
            </div>

            <p className="max-w-3xl sm:max-w-4xl w-full mt-4 sm:mt-5 text-center text-sm sm:text-base">
              Unser Team übernimmt die komplette Montage und Demontage Ihres
              Turmdrehkrans &ndash; von der Planung und Baustellenlogistik über
              Ballastierung und Elektroanschluss bis zur sicheren Abnahme.
              Kurzfristige Termine möglich.
            </p>

            <Link
              to="/de-montage"
              className="mt-6 sm:mt-8 px-5 sm:px-6 py-2 flex gap-2 sm:gap-3 rounded-md text-white text-sm sm:text-base tracking-wider uppercase bg-blue-400 transition-all duration-300 hover:shadow-lg hover:bg-[#7c5e74] ease-in"
            >
              Leistungsumfang ansehen
            </Link>
          </div>
        </section>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <OfferForm onClose={() => setIsOpen(false)} variant="transport" />
      </Modal>
    </>
  );
}

export default TransportPage;
