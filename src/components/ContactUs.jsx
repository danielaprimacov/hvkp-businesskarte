import { Link } from "react-router-dom";

import { useContent } from "../content/content";

import companyImg from "../assets/images/Kran.jpg";

function ContactUs() {
  const { content } = useContent();
  const text = content.seiten.startseite.kontaktbereich.leistungsbeschreibung;
  const paragraph = content.seiten.startseite.kontaktbereich.hinweistext;
  const question = content.seiten.startseite.kontaktbereich.frage;

  return (
    <div className="pt-5">
      <div className="px-4 sm:px-6 md:px-10 pb-12 md:pb-30 flex flex-col md:flex-row md:justify-between items-center md:items-center gap-6 sm:gap-8 md:gap-10">
        <img
          src={companyImg}
          className="w-full max-w-[40rem] md:max-w-none h-64 sm:h-80 md:h-[25rem] object-cover rounded-md shadow-sm mx-auto"
          alt="Unternehmen Kontakt"
          loading="lazy"
        />
        <section className="w-full max-w-[40rem] md:max-w-none flex flex-col justify-center items-center gap-4 sm:gap-5 text-center mx-auto">
          <div className="md:w-150 text-base sm:text-lg md:text-xl text-black/70">
            {text}
            <div className="pt-5">{paragraph}</div>
          </div>
          <p className="text-blue-700 my-4 sm:my-5 text-base sm:text-lg">
            {question}
          </p>
          <Link
            to="/kontakt"
            className="py-4 sm:py-5 px-8 sm:px-10 rounded-md bg-blue-700 text-white text-base sm:text-lg tracking-wider transition duration-300 hover:bg-blue-600 hover:scale-105"
          >
            Kontaktieren Sie uns
          </Link>
        </section>
      </div>
    </div>
  );
}

export default ContactUs;
