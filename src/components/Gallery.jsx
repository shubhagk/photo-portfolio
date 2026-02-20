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
