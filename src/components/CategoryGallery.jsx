import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://www.taruitsolutions.com/gallery.php?page=1&limit=1000";

const IMAGE_ROOT = "https://www.taruitsolutions.com";
const PLACEHOLDER_COUNT = 8;

export default function CategoryGallery() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  /* ---------------- Fetch images ---------------- */
  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}&ts=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.images || []).filter(
          (img) => img.category === category && img.thumb && img.full,
        );
        setImages(filtered);
        setLoading(false);
      })
      .catch(() => {
        setImages([]);
        setLoading(false);
      });
  }, [category]);

  /* ---------------- Lock scroll when lightbox open ---------------- */
  useEffect(() => {
    if (active !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  /* ---------------- Keyboard navigation ---------------- */
  useEffect(() => {
    if (active === null) return;

    const handleKey = (e) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setActive((i) => (i - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, images.length]);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      {/* Page */}
      <div className="min-h-screen bg-[#0a0806] pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-serif text-white capitalize">
              {category}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-300 hover:text-white"
            >
              ← Back
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div
                key={img.thumb}
                className="relative overflow-hidden rounded-lg bg-[#1a1410] animate-pulse"
                style={{ aspectRatio: "4 / 3" }}
                onClick={() => setActive(index)}
              >
                <img
                  src={`${IMAGE_ROOT}/images/thumbs/${category.toLowerCase()}/${img.thumb}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={450}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0"
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.parentElement.classList.remove(
                      "animate-pulse",
                    );
                  }}
                />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {!loading && images.length === 0 && (
            <p className="text-center text-gray-400 mt-16">
              No images found in this category.
            </p>
          )}
        </div>
      </div>

      {/* ---------------- Lightbox ---------------- */}
      {active !== null && images[active] && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onClick={() => setActive(null)}
        >
          {/* Image */}
          <img
            src={`${IMAGE_ROOT}/images/full/${category.toLowerCase()}/${images[active].full}`}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close */}
          <button
            onClick={() => setActive(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-6 text-white text-5xl hover:opacity-80"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i + 1) % images.length);
            }}
            className="absolute right-6 text-white text-5xl hover:opacity-80"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
