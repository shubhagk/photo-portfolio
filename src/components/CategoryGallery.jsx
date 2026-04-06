import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://d2keqyvqexxfrb.cloudfront.net";

export default function CategoryGallery() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  /* -------------------------------
     FETCH CATEGORY IMAGES
  --------------------------------*/
  useEffect(() => {
    fetch(`${API_URL}/images.json`) // ✅ FIXED
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (img) => img.category?.toLowerCase() === category.toLowerCase(),
        );

        setImages(filtered);
      })
      .catch((err) => console.error("Image load error:", err));
  }, [category]);

  /* -------------------------------
     LIVE SEARCH SUGGESTIONS
  --------------------------------*/
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = images
      .filter(
        (img) => img.url.toLowerCase().includes(search.toLowerCase()), // ✅ FIXED
      )
      .slice(0, 6);

    setSuggestions(matches);
  }, [search, images]);

  /* -------------------------------
     FILTER IMAGES
  --------------------------------*/
  const filteredImages = images.filter(
    (img) => img.url.toLowerCase().includes(search.toLowerCase()), // ✅ FIXED
  );

  /* -------------------------------
     LIGHTBOX CONTROLS
  --------------------------------*/
  const close = () => setActiveIndex(null);

  const showPrev = () =>
    setActiveIndex(
      (i) => (i - 1 + filteredImages.length) % filteredImages.length,
    );

  const showNext = () => setActiveIndex((i) => (i + 1) % filteredImages.length);

  /* -------------------------------
     KEYBOARD SUPPORT
  --------------------------------*/
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
  }, [activeIndex, filteredImages.length]);

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* BACK */}
          <button
            onClick={() => navigate("/gallery")}
            className="mb-8 text-amber-400 hover:underline"
          >
            ← Back to Gallery
          </button>

          <h1 className="text-3xl md:text-4xl font-serif mb-10 capitalize">
            {category}
          </h1>

          {/* SEARCH */}
          <div className="relative flex justify-center mb-12">
            <input
              type="text"
              placeholder="Search photos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-5 py-3 rounded-full bg-[#1a140d] text-white border border-amber-400/30 focus:outline-none focus:border-amber-400"
            />

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full max-w-md bg-[#1a140d] border border-amber-400/20 rounded-xl shadow-xl z-40">
                {suggestions.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const index = filteredImages.findIndex(
                        (image) => image.url === img.url,
                      );
                      setActiveIndex(index);
                      setSearch("");
                      setSuggestions([]);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-[#241a10] cursor-pointer"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />

                    <span className="text-gray-200 text-sm truncate">
                      {img.url.split("/").pop()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className="cursor-pointer group relative overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={img.url}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null &&
        createPortal(
          <>
            <div
              onClick={close}
              className="fixed inset-0 bg-black/90 z-[99998]"
            />

            <img
              src={filteredImages[activeIndex].url}
              alt=""
              className="fixed inset-0 m-auto max-w-[90vw] max-h-[90vh] z-[99999] rounded-xl"
            />

            <button
              onClick={close}
              className="fixed top-5 right-5 z-[100000] w-14 h-14 rounded-full bg-white text-black text-4xl"
            >
              ×
            </button>

            <button
              onClick={showPrev}
              className="fixed left-5 top-1/2 z-[100000] w-14 h-14 bg-white text-black text-3xl"
            >
              ‹
            </button>

            <button
              onClick={showNext}
              className="fixed right-5 top-1/2 z-[100000] w-14 h-14 bg-white text-black text-3xl"
            >
              ›
            </button>
          </>,
          document.body,
        )}
    </>
  );
}
