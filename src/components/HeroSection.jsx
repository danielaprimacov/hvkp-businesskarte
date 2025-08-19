import { useRef, useState } from "react";

import Modal from "./ui/Modal";
import OfferForm from "./OfferForm";

import playIcon from "../assets/icons/play.png";
import stopIcon from "../assets/icons/stop-circle.png";
import videoMp4 from "../assets/video/introVideo.mp4";
import videoWebm from "../assets/video/introVideo.webm";

function HeroSection() {
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
      <div className="relative w-full h-screen overflow-hidden" id="hero">
        <video
          className="absolute inset-0 w-full h-full object-cover blur-[1px] scale-101"
          ref={videoRef}
          autoPlay
          loop
          muted
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={videoWebm} type="video/webm" />
          <source src={videoMp4} type="video/mp4" />
          Ihr Browser unterstützt das HTML5-Video nicht.
        </video>
        <button
          className="absolute bottom-5 left-3 z-20 cursor-pointer"
          onClick={togglePlay}
        >
          {playing ? (
            <img className="w-12" src={stopIcon} alt="Stop Video" />
          ) : (
            <img className="w-12" src={playIcon} alt="Play Video" />
          )}
        </button>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        <div className="text-center text-white uppercase [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]">
          <p className="text-7xl tracking-widest">Hovekamp</p>
          <p className="text-3xl mt-4 tracking-wider">
            Planung, Montage, Logistik &ndash; alles aus einer Hand
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-14 px-6 py-2 rounded-md text-white text-xl tracking-wider uppercase bg-blue-400 cursor-pointer transition duration-300 hover:scale-110 ease-in"
        >
          Angebot anfordern
        </button>
      </div>

      <div id="hero-after" className="h-px mt-12" aria-hidden="true" />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <OfferForm onClose={() => setIsOpen(false)} variant="general" />
      </Modal>
    </>
  );
}

export default HeroSection;
