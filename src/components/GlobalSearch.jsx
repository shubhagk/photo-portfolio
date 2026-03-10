import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://xd9awgtwlj.execute-api.eu-north-1.amazonaws.com";

export default function GlobalSearch() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  /* -----------------------------
     LOAD ALL IMAGES
  ----------------------------- */
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Search load error:", err));
  }, []);

  /* -----------------------------
     LIVE SEARCH
  ----------------------------- */
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const matches = images.filter((img) =>
      img.key.toLowerCase().includes(search.toLowerCase()),
    );

    setResults(matches);
  }, [search, images]);

  /* -----------------------------
     LIGHTBOX CONTROLS
  ----------------------------- */
  const close = () => setActiveIndex(null);

  const showPrev = () =>
    setActiveIndex((i) => (i - 1 + results.length) % results.length);

  const showNext = () => setActiveIndex((i) => (i + 1) % results.length);

  /* -----------------------------
     KEYBOARD NAVIGATION
  ----------------------------- */
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

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* TITLE */}
          <h1 className="text-4xl font-serif text-center mb-10">
            Search Wildlife
          </h1>

          {/* SEARCH BOX */}
          <div className="flex justify-center mb-14">
            <input
              type="text"
              placeholder="Search animals, birds, wildlife..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full max-w-lg
                px-6 py-4
                rounded-full
                bg-[#1a140d]
                text-white
                border border-amber-400/30
                focus:outline-none
                focus:border-amber-400
              "
            />
          </div>

          {/* RESULTS GRID */}
          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((img, index) => (
                <div
                  key={img.key}
                  onClick={() => setActiveIndex(index)}
                  className="
                    cursor-pointer
                    group
                    overflow-hidden
                    rounded-xl
                    aspect-[4/3]
                    relative
                  "
                >
                  <img
                    src={img.url}
                    alt={img.key}
                    loading="lazy"
                    className="
                      w-full h-full object-cover
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                  />

                  {/* CATEGORY LABEL */}
                  <div
                    className="
                      absolute bottom-0 left-0 right-0
                      bg-black/60
                      text-xs text-gray-300
                      px-3 py-1
                    "
                  >
                    {img.category}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NO RESULTS */}
          {search && results.length === 0 && (
            <p className="text-center text-gray-400">No results found</p>
          )}
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
              src={results[activeIndex].url}
              alt=""
              className="
                fixed inset-0
                m-auto
                max-w-[90vw]
                max-h-[90vh]
                rounded-xl
                shadow-2xl
                z-[99999]
              "
            />

            {/* CLOSE */}
            <button
              onClick={close}
              className="
                fixed top-5 right-5
                z-[100000]
                w-14 h-14
                rounded-full
                bg-white text-black
                text-4xl font-bold
              "
            >
              ×
            </button>

            {/* PREV */}
            <button
              onClick={showPrev}
              className="
                fixed left-5 top-1/2 -translate-y-1/2
                z-[100000]
                w-14 h-14
                rounded-full
                bg-white text-black
                text-3xl
              "
            >
              ‹
            </button>

            {/* NEXT */}
            <button
              onClick={showNext}
              className="
                fixed right-5 top-1/2 -translate-y-1/2
                z-[100000]
                w-14 h-14
                rounded-full
                bg-white text-black
                text-3xl
              "
            >
              ›
            </button>
          </>,
          document.body,
        )}
    </>
  );
}
