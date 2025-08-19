import { Link, useLocation } from "react-router-dom";

import MapLink from "../ui/MapLink";

import facebookIcon from "../../assets/icons/facebook.png";
import instagramIcon from "../../assets/icons/instagram.png";
import locationIcon from "../../assets/icons/marker.png";
import whatsappIcon from "../../assets/icons/whatsapp.png";

function Footer() {
  const { pathname } = useLocation();

  const ADDRESS = "Hovekampsweg 15, 48485 Neuenkirchen, Germany";

  const theme = pathname.startsWith("/transport")
    ? { to: "to-blue-300", h3: "text-blue-700" }
    : pathname.startsWith("/de-montage")
    ? { to: "to-[#a48894]", h3: "text-[#a48894]" }
    : pathname.startsWith("/reparatur")
    ? { to: "to-[#4d898a]", h3: "text-[#4d898a]" }
    : { to: "to-blue-300", h3: "text-blue-700" };

  return (
    <div
      className={`p-10 mt-5 bg-gradient-to-b from-white ${theme.to} flex justify-between`}
    >
      {/* Kontakt */}
      <div className="mt-5 flex flex-col gap-0.5">
        <h3 className={`${theme.h3} uppercase`}>Adresse</h3>
        <MapLink address={ADDRESS} className="group inline-block">
          {/* Line 1 */}
          <span className="relative block whitespace-nowrap">
            <span aria-hidden className="invisible block font-medium leading-6">
              Hovekampsweg 15
            </span>
            <span className="pointer-events-none absolute inset-0 block leading-6 text-black/70 transition-opacity group-hover:opacity-0">
              Hovekampsweg 15
            </span>
            <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
              Hovekampsweg 15
            </span>
          </span>

          {/* Line 2 */}
          <span className="relative block whitespace-nowrap">
            <span aria-hidden className="invisible block font-medium leading-6">
              48485 Neuenkirchen, Germany
            </span>
            <span className="pointer-events-none absolute inset-0 block leading-6 text-black/70 transition-opacity group-hover:opacity-0">
              48485 Neuenkirchen, Germany
            </span>
            <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
              48485 Neuenkirchen, Germany
            </span>
          </span>
        </MapLink>

        {/* Phone (click-to-call) */}
        <a href="tel:+4915901212377" className="group inline-block">
          <span className="relative inline-block whitespace-nowrap">
            <span aria-hidden className="invisible block font-medium leading-6">
              +49 1590 1212377
            </span>
            <span className="pointer-events-none absolute inset-0 block leading-6 text-black/70 transition-opacity group-hover:opacity-0">
              +49 1590 1212377
            </span>
            <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
              +49 1590 1212377
            </span>
          </span>
        </a>
      </div>
      {/* Links */}
      <div className="mt-5 flex flex-col gap-0.5">
        <h3 className={`${theme.h3} uppercase`}>Entdecken</h3>
        <ul className="space-y-1">
          <li>
            <Link
              to="/transport"
              className="group relative inline-block whitespace-nowrap"
            >
              {/* sizer: reserves width/height for the widest state */}
              <span
                aria-hidden
                className="invisible block font-medium leading-6"
              >
                Krantransporte
              </span>

              {/* normal state */}
              <span className="pointer-events-none absolute inset-0 block leading-6 text-black/70 transition-opacity group-hover:opacity-0">
                Krantransporte
              </span>

              {/* hover state (no layout change) */}
              <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                Krantransporte
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/de-montage"
              className="group relative inline-block whitespace-nowrap"
            >
              {/* sizer: reserves width/height for the widest state */}
              <span
                aria-hidden
                className="invisible block font-medium leading-6"
              >
                Montage &amp; Demontage
              </span>

              {/* normal state */}
              <span className="pointer-events-none absolute inset-0 block leading-6 text-black/70 transition-opacity group-hover:opacity-0">
                Montage &amp; Demontage
              </span>

              {/* hover state (no layout change) */}
              <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                Montage &amp; Demontage
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/reparatur"
              className="group relative inline-block whitespace-nowrap"
            >
              {/* sizer: reserves width/height for the widest state */}
              <span
                aria-hidden
                className="invisible block font-medium leading-6"
              >
                Reparatur &amp; Ersatzteile
              </span>

              {/* normal state */}
              <span className="pointer-events-none absolute inset-0 block leading-6 text-black/70 transition-opacity group-hover:opacity-0">
                Reparatur &amp; Ersatzteile
              </span>

              {/* hover state (no layout change) */}
              <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                Reparatur &amp; Ersatzteile
              </span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-5 flex flex-col gap-0.5">
        <h3 className={`${theme.h3} uppercase`}>Kontakt & Impressum</h3>
        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              className="group relative inline-block whitespace-nowrap"
            >
              {/* sizer: reserves width/height for the widest state */}
              <span
                aria-hidden
                className="invisible block font-medium leading-6"
              >
                Kontaktieren Sie uns
              </span>

              {/* normal state */}
              <span className="pointer-events-none absolute inset-0 block leading-6 text-black/70 transition-opacity group-hover:opacity-0">
                Kontaktieren Sie uns
              </span>

              {/* hover state (no layout change) */}
              <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                Kontaktieren Sie uns
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/"
              className="group relative inline-block whitespace-nowrap"
            >
              {/* sizer: reserves width/height for the widest state */}
              <span
                aria-hidden
                className="invisible block font-medium leading-6"
              >
                Impressum
              </span>

              {/* normal state */}
              <span className="pointer-events-none absolute inset-0 block leading-6 text-black/70 transition-opacity group-hover:opacity-0">
                Impressum
              </span>

              {/* hover state (no layout change) */}
              <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                Impressum
              </span>
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
          <MapLink address={ADDRESS} className="inline-block">
            <span
              className="inline-block h-8 w-8 bg-current text-black hover:text-neutral-900 transition-colors duration-300"
              style={{
                WebkitMask: `url(${locationIcon}) center / contain no-repeat`,
                mask: `url(${locationIcon}) center / contain no-repeat`,
              }}
            />
          </MapLink>
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
