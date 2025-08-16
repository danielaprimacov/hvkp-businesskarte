import { Link } from "react-router-dom";

import transportImg from "../assets/images/transport-crane.webp";
import montageDemontageImg from "../assets/images/montage-demontage-crane.webp";
import reparaturImg from "../assets/images/reparatur-crane.webp";

function Services() {
  return (
    <div className="py-15">
      <h1 className="mb-15 text-4xl uppercase font-medium text-center tracking-widest">
        Unsere Leistungen
      </h1>
      <div className="flex justify-evenly items-center gap-10 px-10 pb-15">
        <Link
          to="/transport"
          className="flex flex-1 flex-col border border-gray-200 rounded hover:shadow-sm transition duration-300"
        >
          <div className="flex justify-center items-center">
            <img
              src={transportImg}
              className="h-70 w-full object-cover rounded-t"
              alt="Transport Turmdrehkran"
            />
          </div>
          <div className="text-center py-15">
            <h2 className="text-xl tracking-wider">Krantransporte</h2>
            <p className="pt-3 text-black/70">sicher und pünktlich</p>
          </div>
        </Link>
        <Link
          to="/de-montage"
          className="flex flex-1 flex-col border border-gray-200 rounded hover:shadow-sm transition duration-300"
        >
          <div className="flex justify-center items-center">
            <img
              src={montageDemontageImg}
              className="h-70 w-full object-cover rounded-t"
              alt="Montage oder Demontage Turmdrehkran"
            />
          </div>
          <div className="text-center py-15">
            <h2 className="text-xl tracking-wider">Montage und Demontage</h2>
            <p className="pt-3 text-black/70">fachgerecht und termingerecht</p>
          </div>
        </Link>
        <Link
          to="/reparatur"
          className="flex flex-1 flex-col border border-gray-200 rounded hover:shadow-sm transition duration-300"
        >
          <div className="flex justify-center items-center">
            <img
              src={reparaturImg}
              className="h-70 w-full object-cover rounded-t"
              alt="Reparatur Turmdrehkran"
            />
          </div>
          <div className="text-center py-15">
            <h2 className="text-xl tracking-wider">
              Reparatur und Ersatzteile
            </h2>
            <p className="pt-3 text-black/70">schnell und zuverlässig</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Services;
