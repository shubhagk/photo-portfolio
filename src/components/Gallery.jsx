import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar.jsx";

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const images = [
    { id: 1, src: "/insta4.jpg", alt: "Image 1" },
    { id: 2, src: "/insta2.jpg", alt: "Image 2" },
    { id: 3, src: "/insta3.jpg", alt: "Image 3" },
    { id: 4, src: "/insta1.jpg", alt: "Image 4" },
    { id: 5, src: "/insta5.jpg", alt: "Image 5" },
  ];

  const currentIndex = activeImage
    ? images.findIndex((img) => img.id === activeImage.id)
    : -1;

  const showPrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setActiveImage(images[prevIndex]);
    setZoomLevel(1);
  };

  const showNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setActiveImage(images[nextIndex]);
    setZoomLevel(1);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!activeImage) return;

      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = activeImage ? "hidden" : "auto";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [activeImage]);

  const closeModal = () => {
    setActiveImage(null);
    setZoomLevel(1);
  };

  // ESC + body scroll lock (single effect)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
    };

    if (activeImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    } else {
      document.body.style.overflow = "auto";
    }

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
      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-sm tracking-[0.5em] font-light text-amber-400 mb-4 uppercase">
              Collection
            </h1>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Wildlife Gallery
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A curated selection of moments frozen in time, showcasing the incredible diversity and beauty of our planet's wildlife.
            </p>
          </div>

          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              gap-6
            "
          >
            {images.map((image) => (
              <div
                key={image.id}
                onClick={() => setActiveImage(image)}
                className="
                  group cursor-pointer
                  relative overflow-hidden
                  rounded-xl
                  aspect-[4/3]
                "
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="
                    w-full h-full
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />
                <div className="
                  absolute inset-0
                  bg-gradient-to-t from-black/60 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                " />
                <div className="
                  absolute inset-0
                  border-2 border-amber-400/0
                  group-hover:border-amber-400/50
                  rounded-xl
                  transition-all duration-300
                " />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX (PORTAL) */}
      {activeImage &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              onClick={closeModal}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.9)",
                zIndex: 99998,
              }}
            />

            {/* Image */}
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((z) => (z === 1 ? 2 : 1));
              }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${zoomLevel === 1 ? 1 : 1.5})`,
                maxWidth: "90vw",
                maxHeight: "90vh",
                zIndex: 99999,
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                cursor: zoomLevel === 1 ? "zoom-in" : "zoom-out",
              }}
            />

            {/* CLOSE BUTTON — LOCKED */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 100000,
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "white",
                color: "black",
                fontSize: "36px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Close image"
            >
              ×
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              style={{
                position: "fixed",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 100000,
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "white",
                color: "black",
                fontSize: "32px",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              style={{
                position: "fixed",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 100000,
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "white",
                color: "black",
                fontSize: "32px",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Next image"
            >
              ›
            </button>
          </>,
          document.body,
        )}
    </>
  );
}
