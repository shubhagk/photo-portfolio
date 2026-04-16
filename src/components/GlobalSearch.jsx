import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar.jsx";
import { API_URL } from "../config/config"; // ✅ use your API

export default function GlobalSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const LOAD_COUNT = 16;
  const [visibleCount, setVisibleCount] = useState(LOAD_COUNT);

  /* -----------------------------
     RESET PAGINATION ON SEARCH
  ----------------------------- */
  useEffect(() => {
    setVisibleCount(LOAD_COUNT);
  }, [search]);

  /* -----------------------------
     INFINITE SCROLL
  ----------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setVisibleCount((prev) => prev + LOAD_COUNT);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -----------------------------
     🔥 API SEARCH (NEW)
  ----------------------------- */
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        // 🔥 call your backend
        const res = await fetch(
          `${API_URL}/search?q=${encodeURIComponent(search.toLowerCase())}`,
        );

        const data = await res.json();

        setResults(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
  }, [search]);

  const visibleResults = results.slice(0, visibleCount);

  /* -----------------------------
     LIGHTBOX
  ----------------------------- */
  const close = () => setActiveIndex(null);

  const showPrev = () =>
    setActiveIndex((i) => (i - 1 + results.length) % results.length);

  const showNext = () => setActiveIndex((i) => (i + 1) % results.length);

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
  }, [activeIndex, results.length]);

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-serif text-center mb-10">
            Search Wildlife
          </h1>

          {/* SEARCH */}
          <div className="flex justify-center mb-14">
            <input
              type="text"
              placeholder="Search by country (e.g. india)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-lg px-6 py-4 rounded-full bg-[#1a140d] text-white border border-amber-400/30"
            />
          </div>

          {/* RESULTS */}
          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleResults.map((img, index) => (
                <div
                  key={img.imageId || index}
                  onClick={() => setActiveIndex(index)}
                  className="cursor-pointer group overflow-hidden rounded-xl aspect-[4/3] relative"
                >
                  <img
                    src={img.imageUrl} // ✅ updated
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-gray-300 px-3 py-1">
                    {img.species || img.category}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LOADING */}
          {visibleCount < results.length && (
            <p className="text-center text-gray-400 mt-10">
              Loading more results...
            </p>
          )}

          {/* EMPTY */}
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
              src={results[activeIndex].imageUrl} // ✅ updated
              alt=""
              className="fixed inset-0 m-auto max-w-[90vw] max-h-[90vh] rounded-xl z-[99999]"
            />
          </>,
          document.body,
        )}
    </>
  );
}
