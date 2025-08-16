import headOfTheCompanyImg from "../assets/images/boss.jpg";

function ContactUs() {
  return (
    <div className="pt-5">
      <div className="px-10 pb-30 flex justify-evenly items-center gap-10">
        <img
          src={headOfTheCompanyImg}
          className="h-[30rem] rounded-md shadow-sm"
          alt="Unternehmensleiter Kontakt"
        />
        <section className="flex flex-col justify-center items-center gap-5">
          <div className="w-150 text-xl text-black/70 text-center">
            Von Reparatur bis Montagen, wir haben den kompletten Service rund um
            ihren Turmdrehkran. Sie suchen eine Kran zum Kauf oder zur Miete
            oder einfach nur Ersatzteile?
            <div className="pt-5">
              Fragen Sie bei uns an. Wir haben fast immer das passende Angebot
              für Sie und können auch kurzfristig helfen.
            </div>
          </div>
          <p className="text-blue-700 my-5">
            Sind Sie bereit, Ihr nächstes Projekt zu besprechen?
          </p>
          <button className="py-5 px-10 rounded-md bg-blue-700 text-white text-lg tracking-wider cursor-pointer transition duration-300 hover:bg-blue-600 hover:scale-105">
            Kontaktieren Sie uns
          </button>
        </section>
      </div>
    </div>
  );
}

export default ContactUs;
