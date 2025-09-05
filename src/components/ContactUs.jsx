import { Link } from "react-router-dom";

import { useContent } from "../content/content";

import headOfTheCompanyImg from "../assets/images/boss.jpg";

function ContactUs() {
  const { content } = useContent();
  const text = content.pages.home.contactSection.text;
  const paragraph = content.pages.home.contactSection.paragraph;
  const question = content.pages.home.contactSection.question;

  return (
    <div className="pt-5">
      <div className="px-4 sm:px-6 md:px-10 pb-12 md:pb-30 flex flex-col md:flex-row md:justify-evenly items-center md:items-center gap-6 sm:gap-8 md:gap-10">
        <img
          src={headOfTheCompanyImg}
          className="w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-none h-64 sm:h-80 md:h-[30rem] object-cover rounded-md shadow-sm"
          alt="Unternehmensleiter Kontakt"
          loading="lazy"
        />
        <section className="flex flex-col justify-center items-center gap-4 sm:gap-5 text-center">
          <div className="w-full max-w-[38rem] md:w-150 text-base sm:text-lg md:text-xl text-black/70">
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
