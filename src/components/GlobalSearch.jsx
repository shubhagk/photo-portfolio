import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar.jsx";
import { API_URL } from "../config/config";
import { IMAGES_CLOUDFRONT_API_URL } from "../config/config";

export default function GlobalSearch() {
  const [search, setSearch] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    year: "",
    species: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    countries: [],
    years: [],
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
        const countries = {};
        const years = {};

        const filteredData = data.filter(
          (img) => img.category?.toLowerCase() !== "shuffle",
        );

        filteredData.forEach((img) => {
          // CATEGORY
          if (img.category) {
            categories[img.category] = (categories[img.category] || 0) + 1;
          }
        });

        setFilterOptions({
          categories: Object.entries(categories)
            .map(([value, count]) => ({
              value,
              count,
            }))
            .sort((a, b) => b.value - a.value), // latest first
        });
      })
      .catch((err) => console.error("Filter load error:", err));
  }, []);
  /* ---------------- CLEAR ALL ---------------- */
  const clearAllFilters = () => {
    setSearch("");
    setFilters({
      category: "",
    });
    setResults([]);
    setVisibleCount(LOAD_COUNT);
    setActiveIndex(null);
  };

  /* ---------------- SEARCH ---------------- */
  const fetchResultsManual = async () => {
    try {
      setLoading(true);

      const queryParts = [];

      if (search) queryParts.push(search);
      if (filters.category) queryParts.push(filters.category);
      if (filters.city) queryParts.push(filters.city);
      if (filters.year) queryParts.push(filters.year);
      if (filters.species) queryParts.push(filters.species);

      const finalQuery = queryParts.join(" ").trim();

      if (!finalQuery) {
        setResults([]);
        return;
      }

      // ✅ Save what user searched
      setLastQuery(finalQuery);

      const url = `${API_URL}/search?q=${encodeURIComponent(finalQuery)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      setResults(Array.isArray(data) ? data : []);
      setVisibleCount(LOAD_COUNT);

      // 🔥 CLEAR INPUTS AFTER SEARCH
      setSearch("");
      setFilters({
        category: "",
        city: "",
        year: "",
        species: "",
      });
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INFINITE SCROLL ---------------- */
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
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* TITLE */}
          <h1 className="text-4xl font-serif text-center mb-8">
            Search Wildlife
          </h1>

          {/* SEARCH BAR */}
          <div className="flex justify-center gap-3 mb-10">
            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xl px-6 py-4 rounded-full bg-[#1a140d] text-white border border-amber-400/30"
            />

            <button
              onClick={fetchResultsManual}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-full font-semibold"
            >
              Search
            </button>

            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>

          {/* MAIN LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* LEFT SIDEBAR */}
            <div className="md:col-span-1 bg-[#1a140d] p-4 rounded-xl h-fit sticky top-28">
              <h2 className="text-lg mb-4 font-semibold text-amber-400">
                Filters
              </h2>

              {/* CATEGORY */}
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full mb-3 px-3 py-2 bg-black text-white rounded"
              >
                <option value="">All Categories</option>

                {filterOptions.categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.value} ({c.count})
                  </option>
                ))}
              </select>

              {/* APPLY */}
              <button
                onClick={fetchResultsManual}
                className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded"
              >
                Apply Filters
              </button>

              {/* CLEAR */}
              <button
                onClick={clearAllFilters}
                className="w-full mt-2 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-700/30"
              >
                Clear All
              </button>
            </div>

            {/* RIGHT RESULTS */}
            <div className="md:col-span-3">
              <p className="text-gray-400 mb-4">Results: {results.length}</p>

              {loading && <p className="text-gray-400">Searching...</p>}
              {lastQuery && results.length > 0 && (
                <p className="text-xl text-gray-400 mb-10">
                  Here are the search results for your search criteria —{" "}
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
                <p className="text-gray-400 mt-10">No results found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null &&
        createPortal(
          <>
            {/* Overlay (below navbar) */}
            <div
              onClick={close}
              className="fixed left-0 right-0 bottom-0 top-20 bg-black/90 z-[99998]"
            />

            {/* Back Button */}
            <button
              onClick={close}
              className="fixed top-24 left-6 z-[99999] bg-black/70 text-white px-4 py-2 rounded hover:bg-black"
            >
              ← Back
            </button>

            {/* Image */}
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
