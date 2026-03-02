import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://www.taruitsolutions.com/gallery.php";
const IMAGES_BASE_URL = "https://www.taruitsolutions.com/images";

export default function CategoryGallery() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}?page=1&limit=1000&ts=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.images || []).filter(
          (img) => img.category === category && img.thumb && img.full,
        );

        setImages(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Category gallery fetch failed:", err);
        setImages([]);
        setLoading(false);
      });
  }, [category]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, images.length]);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      {/* Page */}
      <div className="min-h-screen bg-[#0a0806] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-serif capitalize tracking-widest text-white">
              {category}
            </h1>

            <button
              onClick={() => navigate(-1)}
              className="text-sm tracking-widest text-gray-300 hover:text-white transition"
            >
              ← Back
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-400 text-lg">Loading images…</p>
          )}

          {/* Grid */}
          {!loading && images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className="cursor-pointer group"
                >
                  <div className="relative h-[220px] md:h-[260px] overflow-hidden rounded-lg bg-black">
                    <img
                      src={`${IMAGES_BASE_URL}/${img.thumb}`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && images.length === 0 && (
            <p className="text-center text-gray-400 mt-20">
              No images found in this category.
            </p>
          )}
        </div>
      </div>

      {/* 🔥 LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <img
            src={`${IMAGES_BASE_URL}/${images[lightboxIndex].full}`}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white text-3xl select-none"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-6 text-white text-4xl select-none"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-6 text-white text-4xl select-none"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
