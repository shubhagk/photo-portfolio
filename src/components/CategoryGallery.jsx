import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://xd9awgtwlj.execute-api.eu-north-1.amazonaws.com";

export default function CategoryGallery() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  /* -------------------------------
     FETCH CATEGORY IMAGES
     ------------------------------- */
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) =>
        setImages(data.filter((img) => img.category === category)),
      );
  }, [category]);

  /* -------------------------------
     LIGHTBOX CONTROLS
     ------------------------------- */
  const close = () => setActiveIndex(null);

  const showPrev = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);

  const showNext = () => setActiveIndex((i) => (i + 1) % images.length);

  /* -------------------------------
     KEYBOARD SUPPORT
     ------------------------------- */
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [activeIndex]);

  /* -------------------------------
     RENDER
     ------------------------------- */
  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      {/* PAGE */}
      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* BACK */}
          <button
            onClick={() => navigate("/gallery")}
            className="mb-8 text-amber-400 hover:underline"
          >
            ← Back to Gallery
          </button>

          <h1 className="text-3xl md:text-4xl font-serif mb-12 capitalize">
            {category}
          </h1>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div
                key={img.key}
                onClick={() => setActiveIndex(index)}
                className="cursor-pointer group relative overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={img.url}
                  alt={img.key}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -------------------------------
         LIGHTBOX (PORTAL)
         ------------------------------- */}
      {activeIndex !== null &&
        createPortal(
          <>
            {/* BACKDROP */}
            <div
              onClick={close}
              className="fixed inset-0 bg-black/90 z-[99998]"
            />

            {/* IMAGE */}
            <img
              src={images[activeIndex].url}
              alt=""
              className="fixed inset-0 m-auto max-w-[90vw] max-h-[90vh] z-[99999] rounded-xl shadow-2xl"
            />

            {/* CLOSE */}
            <button
              onClick={close}
              className="fixed top-5 right-5 z-[100000] w-14 h-14 rounded-full bg-white text-black text-4xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            {/* PREV */}
            <button
              onClick={showPrev}
              className="fixed left-5 top-1/2 -translate-y-1/2 z-[100000] w-14 h-14 rounded-full bg-white text-black text-3xl"
              aria-label="Previous"
            >
              ‹
            </button>

            {/* NEXT */}
            <button
              onClick={showNext}
              className="fixed right-5 top-1/2 -translate-y-1/2 z-[100000] w-14 h-14 rounded-full bg-white text-black text-3xl"
              aria-label="Next"
            >
              ›
            </button>
          </>,
          document.body,
        )}
    </>
  );
}
