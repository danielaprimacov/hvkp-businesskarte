import contactBackground from "../assets/images/contact-background.jpg";

import { OsmMap } from "../components/ui/OsmMap";

const ADDRESS = "Hovekampsweg 15, 48485 Neuenkirchen, Germany";

function ContactPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative h-[32svh] sm:h-[40svh] md:h-120 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={contactBackground}
          alt="Contact Background Image"
          loading="lazy"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 mt-24 sm:mt-40 md:mt-50 flex items-center">
          <div className="text-white bg-black/30 px-4 sm:px-5 py-2 text-center rounded-md">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold tracking-wider">
              Kontakt
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section>
        <div className="flex flex-col justify-center items-center px-4 sm:px-6">
          <p className="m-6 sm:m-8 md:m-10 text-lg sm:text-xl md:text-2xl uppercase font-medium tracking-wider text-center">
            Haben Sie Fragen zu unserem Angeboten oder wünschen Sie ein
            individuelles Angebot?
          </p>
          <p className="text-blue-700 text-base sm:text-lg md:text-xl">
            Wir sind gerne für Sie da.
          </p>
          <p className="mb-10 sm:mb-14 md:mb-20 text-center">
            Worauf warten? Rufen Sie uns einfach an oder schreiben Sie uns eine
            E-Mail.
          </p>
        </div>

        {/* Contacts + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-6 px-6 sm:px-10 lg:px-40 mb-10">
          {/* Left column: phone + email (+ opening hours on desktop) */}
          <div className="w-full max-w-xl flex flex-col space-y-1">
            <a href="tel:+4915901212377" className="group inline-block">
              <span className="relative inline-block whitespace-nowrap">
                <span
                  aria-hidden
                  className="invisible block font-medium leading-6"
                >
                  T: +49 1590 1212377
                </span>
                <span className="pointer-events-none absolute inset-0 block leading-6 transition-opacity group-hover:opacity-0">
                  T: +49 1590 1212377
                </span>
                <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                  T: +49 1590 1212377
                </span>
              </span>
            </a>

            <a href="mailto:michael@hovekamp.eu" className="group inline-block">
              <span className="relative inline-block whitespace-nowrap">
                <span
                  aria-hidden
                  className="invisible block font-medium leading-6"
                >
                  E: michael@hovekamp.eu
                </span>
                <span className="pointer-events-none absolute inset-0 block leading-6 transition-opacity group-hover:opacity-0">
                  E: michael@hovekamp.eu
                </span>
                <span className="pointer-events-none absolute inset-0 block leading-6 font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                  E: michael@hovekamp.eu
                </span>
              </span>
            </a>

            {/* Öffnungszeiten directly under email on desktop */}
            <div className="hidden lg:block mt-2">
              <p>Unsere Öffnungszeiten sind:</p>
              <p>Mo - So. Nur nach Vereinbarung</p>
            </div>
          </div>

          {/* Map (right on desktop) */}
          <div className="w-full lg:pl-4">
            <OsmMap lat={52.24641172535073} lng={7.365852760569325} />
          </div>

          {/* Öffnungszeiten below the map on mobile only */}
          <div className="lg:hidden mt-2">
            <p>Unsere Öffnungszeiten sind:</p>
            <p>Mo - So. Nur nach Vereinbarung</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
