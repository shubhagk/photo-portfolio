import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar.jsx";
import { API_URL, IMAGES_CLOUDFRONT_API_URL } from "../config/config";

export default function GlobalSearch() {
  const [search, setSearch] = useState("");
  const [lastQuery, setLastQuery] = useState("");

  const [filters, setFilters] = useState({
    category: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
  });

  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const LOAD_COUNT = 16;
  const [visibleCount, setVisibleCount] = useState(LOAD_COUNT);

  /* ---------------- FETCH FILTER OPTIONS ---------------- */
  useEffect(() => {
    fetch(`${IMAGES_CLOUDFRONT_API_URL}/images.json`)
      .then((res) => res.json())
      .then((data) => {
        const categories = {};

        const filteredData = data.filter(
          (img) => img.category?.toLowerCase() !== "shuffle",
        );

        filteredData.forEach((img) => {
          if (img.category) {
            categories[img.category] = (categories[img.category] || 0) + 1;
          }
        });

        setFilterOptions({
          categories: Object.entries(categories).map(([value, count]) => ({
            value,
            count,
          })),
        });
      })
      .catch((err) => console.error("Filter load error:", err));
  }, []);

  /* ---------------- CLEAR ---------------- */
  const clearAllFilters = () => {
    setSearch("");
    setFilters({ category: "" });
    setResults([]);
    setVisibleCount(LOAD_COUNT);
    setActiveIndex(null);
    setLastQuery("");
  };

  /* ---------------- SEARCH ---------------- */
  const fetchResultsManual = async () => {
    try {
      setLoading(true);

      const finalQuery = search || filters.category;

      if (!finalQuery) {
        setResults([]);
        return;
      }

      setLastQuery(finalQuery);

      const url = `${API_URL}/search?q=${encodeURIComponent(finalQuery)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      setResults(Array.isArray(data) ? data : []);
      setVisibleCount(LOAD_COUNT);

      // clear inputs AFTER search
      setSearch("");
      setFilters({ category: "" });
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SCROLL ---------------- */
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

  const visibleResults = results.slice(0, visibleCount);

  /* ---------------- LIGHTBOX ---------------- */
  const close = () => setActiveIndex(null);

  return (
    <>
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-serif text-center mb-8">
            Search Wildlife
          </h1>

          {/* 🔥 SEARCH OR CATEGORY */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl">
              {/* CATEGORY DROPDOWN */}
              <select
                value={filters.category}
                onChange={(e) => {
                  setFilters({ category: e.target.value });
                  setSearch(""); // clear search if selecting category
                }}
                className="flex-1 px-4 py-4 rounded-full bg-[#1a140d] text-white border border-amber-400/30"
              >
                <option value="">Select Category</option>
                {filterOptions.categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.value} ({c.count})
                  </option>
                ))}
              </select>

              {/* SEARCH INPUT */}
              <input
                type="text"
                placeholder="Search anything..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFilters({ category: "" }); // clear category if typing
                }}
                className="flex-1 px-6 py-4 rounded-full bg-[#1a140d] text-white border border-amber-400/30"
              />

              <span className="text-gray-400 hidden md:block">OR</span>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                onClick={fetchResultsManual}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-full font-semibold"
              >
                Search
              </button>

              <button
                onClick={clearAllFilters}
                className="px-6 py-3 border border-gray-500 text-gray-300 rounded-full hover:bg-gray-700/30"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* RESULTS */}
          <div className="md:col-span-3">
            <p className="text-gray-400 mb-4">Results: {results.length}</p>

            {loading && <p className="text-gray-400">Searching...</p>}

            {lastQuery && results.length > 0 && (
              <p className="text-lg text-gray-400 mb-6">
                Results for —{" "}
                <span className="text-amber-400">"{lastQuery}"</span>
              </p>
            )}

            {visibleResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleResults.map((img, index) => (
                  <div
                    key={img.imageId || index}
                    onClick={() => setActiveIndex(index)}
                    className="cursor-pointer group overflow-hidden rounded-xl aspect-[4/3]"
                  >
                    <img
                      src={img.imageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />

                    <div className="bg-black/60 text-xs text-gray-300 px-3 py-1">
                      {img.species || img.category} • {img.city}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && results.length === 0 && (
              <p className="text-gray-400 mt-10 text-center">
                No results found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null &&
        createPortal(
          <>
            <div
              onClick={close}
              className="fixed left-0 right-0 bottom-0 top-20 bg-black/90 z-[99998]"
            />

            <button
              onClick={close}
              className="fixed top-24 left-6 z-[99999] bg-black/70 text-white px-4 py-2 rounded"
            >
              ← Back
            </button>

            <img
              src={results[activeIndex].imageUrl}
              alt=""
              className="fixed top-24 left-0 right-0 m-auto max-w-[90vw] max-h-[85vh] rounded-xl z-[99999]"
            />
          </>,
          document.body,
        )}
    </>
  );
}
