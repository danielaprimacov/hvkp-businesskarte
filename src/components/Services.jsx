import { Link } from "react-router-dom";

import transportImg from "../assets/images/transport-crane.webp";
import montageDemontageImg from "../assets/images/montage-demontage-crane.webp";
import reparaturImg from "../assets/images/reparatur-crane.webp";

function Services() {
  return (
    <div className="py-10 sm:py-12 md:py-15">
      <h1 className="mb-8 sm:mb-10 md:mb-15 text-2xl sm:text-3xl md:text-4xl uppercase font-medium text-center tracking-widest">
        Unsere Leistungen
      </h1>
      <div className="flex flex-col md:flex-row md:justify-evenly items-stretch md:items-start gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-10 pb-10 md:pb-15">
        <Link
          to="/transport"
          className="flex flex-1 flex-col h-full border border-gray-200 rounded hover:shadow-sm transition duration-300"
        >
          <div className="flex justify-center items-center">
            <img
              src={transportImg}
              className="w-full h-48 sm:h-56 md:h-70 object-cover rounded-t"
              alt="Transport Turmdrehkran"
              loading="lazy"
            />
          </div>
          <div className="text-center py-8 sm:py-10 md:py-15">
            <div className="min-h-[3.5rem] md:min-h-[2.75rem] flex items-center justify-center">
              <h2 className="text-lg sm:text-xl tracking-wider">
                Krantransporte
              </h2>
            </div>
            <p className="pt-2 sm:pt-3 text-black/70">sicher und pünktlich</p>
          </div>
        </Link>
        <Link
          to="/de-montage"
          className="flex flex-1 flex-col h-full border border-gray-200 rounded hover:shadow-sm transition duration-300"
        >
          <div className="flex justify-center items-center">
            <img
              src={montageDemontageImg}
              className="w-full h-48 sm:h-56 md:h-70 object-cover rounded-t"
              alt="Montage oder Demontage Turmdrehkran"
              loading="lazy"
            />
          </div>
          <div className="text-center py-8 sm:py-10 md:py-15">
            <div className="min-h-[3.5rem] md:min-h-[2.75rem] flex items-center justify-center">
              <h2 className="text-lg sm:text-xl tracking-wider">
                Montage und Demontage
              </h2>
            </div>

            <p className="pt-2 sm:pt-3 text-black/70">
              fachgerecht und termingerecht
            </p>
          </div>
        </Link>
        <Link
          to="/reparatur"
          className="flex flex-1 flex-col h-full border border-gray-200 rounded hover:shadow-sm transition duration-300"
        >
          <div className="flex justify-center items-center">
            <img
              src={reparaturImg}
              className="w-full h-48 sm:h-56 md:h-70 object-cover rounded-t"
              alt="Reparatur Turmdrehkran"
              loading="lazy"
            />
          </div>
          <div className="text-center py-8 sm:py-10 md:py-15">
            <div className="min-h-[3.5rem] md:min-h-[2.75rem] flex items-center justify-center">
              <h2 className="text-lg sm:text-xl tracking-wider">
                Reparatur und Ersatzteile
              </h2>
            </div>

            <p className="pt-2 sm:pt-3 text-black/70">
              schnell und zuverlässig
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Services;
