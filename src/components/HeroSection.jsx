import { useRef, useState } from "react";

import { useContent } from "../content/content";

import Modal from "./ui/Modal";
import OfferForm from "./OfferForm";

import tuvImg from "../assets/images/pruefung.png";

import playIcon from "../assets/icons/play.png";
import stopIcon from "../assets/icons/stop-circle.png";
import videoMp4 from "../assets/video/introVideo.mp4";
import videoWebm from "../assets/video/introVideo.webm";

function HeroSection() {
  const { content } = useContent();
  const title = content.seiten.startseite.introbereich.abschnittstitel;
  const subtitle = content.seiten.startseite.introbereich.abschnittsuntertitel;

  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const togglePlay = (event) => {
    event.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <div
        className="relative w-full h-[100svh] md:h-screen overflow-hidden"
        id="hero"
      >
        <video
          className="absolute inset-0 w-full h-full object-cover blur-[1px] scale-[1.01]"
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={videoWebm} type="video/webm" />
          <source src={videoMp4} type="video/mp4" />
          Ihr Browser unterstützt das HTML5-Video nicht.
        </video>
        <button
          className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 cursor-pointer"
          onClick={togglePlay}
        >
          {playing ? (
            <img className="w-10 sm:w-12" src={stopIcon} alt="Stop Video" />
          ) : (
            <img className="w-10 sm:w-12" src={playIcon} alt="Play Video" />
          )}
        </button>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        <div className="text-center text-white uppercase [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]">
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-widest">
            {title}
          </p>
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mt-3 sm:mt-4 tracking-wider">
            {subtitle}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-8 sm:mt-12 md:mt-14 h-12 sm:h-12 md:h-12 px-5 sm:px-6 rounded-md text-white text-base sm:text-lg md:text-xl tracking-wider uppercase bg-blue-400 cursor-pointer transition duration-300 hover:scale-110 ease-in"
        >
          Angebot anfordern
        </button>

        <img
          src={tuvImg}
          alt="TÜV Zertifikat"
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 h-36 sm:h-42 md:h-48 lg:h-56 w-auto z-20 select-none pointer-events-none"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        id="hero-after"
        className="h-px mt-8 sm:mt-10 md:mt-12"
        aria-hidden="true"
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <OfferForm onClose={() => setIsOpen(false)} variant="general" />
      </Modal>
    </>
  );
}

export default HeroSection;
