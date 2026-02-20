import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

const images = [
  { id: 1, src: "/insta1.jpg", alt: "Image 1" },
  { id: 2, src: "/insta2.jpg", alt: "Image 2" },
  { id: 3, src: "/insta3.jpg", alt: "Image 3" },
  { id: 4, src: "/insta4.jpg", alt: "Image 4" },
  { id: 5, src: "/insta5.jpg", alt: "Image 5" },
];

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const closeModal = () => {
    setActiveImage(null);
    setZoomLevel(1);
  };

  // ESC key + body scroll lock
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.body.style.overflow = activeImage ? "hidden" : "auto";
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [activeImage]);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      {/* Gallery Grid */}
      <div className="min-h-screen bg-[#0e0b07] pt-24">
        <div
          className="
            max-w-[1200px] mx-auto
            grid [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]
            gap-6 p-[100px]
            bg-[#160d04] rounded-xl
            max-sm:[grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]
            max-sm:gap-4 max-sm:p-6
          "
        >
          {images.map((image) => (
            <div
              key={image.id}
              onClick={() => setActiveImage(image)}
              className="
                cursor-pointer
                bg-black p-1 rounded-xl
                border border-black
                shadow-lg overflow-hidden
                transition-transform duration-300
                hover:scale-105
              "
            >
              <img
                src={image.src}
                alt={image.alt}
                className="
                  w-full h-[200px]
                  object-cover rounded-lg block
                  max-sm:h-[150px]
                "
              />
            </div>
          ))}
        </div>
      </div>

      {/* POPUP MODAL */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel((z) => (z === 1 ? 2 : 1));
            }}
            className={`
        fixed
        top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
        max-w-[95vw] max-h-[95vh]
        object-contain
        rounded-2xl shadow-2xl
        transition-transform duration-300 ease-out
        ${
          zoomLevel === 1
            ? "scale-100 cursor-zoom-in"
            : "scale-150 cursor-zoom-out"
        }
      `}
          />

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className="
        fixed top-6 right-6
        w-10 h-10 rounded-full
        bg-black text-white text-3xl
        flex items-center justify-center
        hover:opacity-70
        z-[101]
      "
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
