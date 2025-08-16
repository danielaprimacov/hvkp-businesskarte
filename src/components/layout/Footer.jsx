import { Link, useLocation } from "react-router-dom";

import facebookIcon from "../../assets/icons/facebook.png";
import instagramIcon from "../../assets/icons/instagram.png";
import xTwitterIcon from "../../assets/icons/twitter-alt-circle.png";
import whatsappIcon from "../../assets/icons/whatsapp.png";

function Footer() {
  const { pathname } = useLocation();

  const theme = pathname.startsWith("/transport")
    ? { to: "to-blue-300", h3: "text-blue-700" }
    : pathname.startsWith("/de-montage")
    ? { to: "to-[#a48894]", h3: "text-[#a48894]" }
    : pathname.startsWith("/reparatur")
    ? { to: "to-blue-700", h3: "text-blue-700" }
    : { to: "to-blue-300", h3: "text-blue-700" };

  return (
    <div
      className={`p-10 mt-5 bg-gradient-to-b from-white ${theme.to} flex justify-between`}
    >
      {/* Kontakt */}
      <div className="mt-5 flex flex-col gap-0.5">
        <h3 className={`${theme.h3} uppercase`}>Adresse</h3>
        <p className="text-black/70">Hovekampsweg 15</p>
        <p className="text-black/70">48485 Neuenkirchen, Germany</p>
        <p className="text-black/70">+49 1590 1212377</p>
      </div>
      {/* Links */}
      <div className="mt-5 flex flex-col gap-0.5">
        <h3 className={`${theme.h3} uppercase`}>Entdecken</h3>
        <ul>
          <li>
            <Link
              to="/transport"
              className="text-black/70 hover:underline hover:text-black"
            >
              Krantransporte
            </Link>
          </li>
          <li>
            <Link
              to="/de-montage"
              className="text-black/70 hover:underline hover:text-black"
            >
              Montage & Demontage
            </Link>
          </li>
          <li>
            <Link
              to="/reparatur"
              className="text-black/70 hover:underline hover:text-black"
            >
              Reparatur & Ersatzteile
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-5 flex flex-col gap-0.5">
        <h3 className={`${theme.h3} uppercase`}>Kontakt & Impressum</h3>
        <ul>
          <li>
            <button className="text-black/70 hover:underline hover:text-black cursor-pointer">
              Kontaktieren Sie uns
            </button>
          </li>
          <li>
            <Link
              to="/"
              className="text-black/70 hover:underline hover:text-black"
            >
              Impressum
            </Link>
          </li>
        </ul>
      </div>

      {/* Social Media */}
      <div className="mt-5 flex flex-col">
        <h3 className={`${theme.h3} uppercase mb-7`}>Social Media</h3>
        <div className="flex justify-between gap-10">
          <Link
            to="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className="inline-block h-8 w-8 bg-current text-black hover:text-blue-600 transition-colors duration-300"
              style={{
                WebkitMask: `url(${facebookIcon}) center / contain no-repeat`,
                mask: `url(${facebookIcon}) center / contain no-repeat`,
              }}
            />
          </Link>
          <Link
            to="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className="inline-block h-8 w-8 bg-current text-black hover:text-pink-600 transition-colors duration-300"
              style={{
                WebkitMask: `url(${instagramIcon}) center / contain no-repeat`,
                mask: `url(${instagramIcon}) center / contain no-repeat`,
              }}
            />
          </Link>
          <Link to="https://x.com" target="_blank" rel="noopener noreferrer">
            <span
              className="inline-block h-8 w-8 bg-current text-black hover:text-neutral-900 transition-colors duration-300"
              style={{
                WebkitMask: `url(${xTwitterIcon}) center / contain no-repeat`,
                mask: `url(${xTwitterIcon}) center / contain no-repeat`,
              }}
            />
          </Link>
          <Link
            to="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className="inline-block h-8 w-8 bg-current text-black hover:text-[#25D366] transition-colors duration-300"
              style={{
                WebkitMask: `url(${whatsappIcon}) center / contain no-repeat`,
                mask: `url(${whatsappIcon}) center / contain no-repeat`,
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
