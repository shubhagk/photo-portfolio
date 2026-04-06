import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://d2keqyvqexxfrb.cloudfront.net";
const ITEMS_PER_PAGE = 6; // 👈 adjust (6 = 2 rows, 12 = bigger pages)

export default function Gallery() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // ✅ pagination state

  /* -------------------------------
     FETCH IMAGES FROM JSON
  --------------------------------*/
  useEffect(() => {
    fetch(`${API_URL}/images.json`)
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};

        const filteredData = data.filter(
          (img) => img.category?.toLowerCase() !== "shuffle",
        );

        filteredData.forEach((img) => {
          if (!grouped[img.category]) {
            grouped[img.category] = {
              category: img.category,
              url: img.url,
              count: 1,
            };
          } else {
            grouped[img.category].count += 1;
          }
        });

        setCategories(Object.values(grouped));
      })
      .catch((err) => console.error("Gallery load error:", err));
  }, []);

  /* -------------------------------
     SEARCH FILTER
  --------------------------------*/
  const filteredCategories = categories.filter((cat) =>
    cat.category.toLowerCase().includes(search.toLowerCase()),
  );

  /* -------------------------------
     PAGINATION LOGIC
  --------------------------------*/
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentCategories = filteredCategories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset to page 1 when searching
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      {/* PAGE */}
      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* HEADER */}
          <div className="text-center mb-16">
            <h1 className="text-sm tracking-[0.5em] font-light text-amber-400 mb-4 uppercase">
              Collection
            </h1>

            <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />

            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Wildlife Gallery
            </h2>

            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore wildlife photographs grouped by category.
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex justify-center mb-14">
            <input
              type="text"
              placeholder="Search wildlife categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full max-w-md
                px-5 py-3
                rounded-full
                bg-[#1a140d]
                text-white
                border border-amber-400/30
                focus:outline-none
                focus:border-amber-400
                transition
              "
            />
          </div>

          {/* CATEGORY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCategories.map((cat) => (
              <div
                key={cat.category}
                onClick={() => navigate(`/gallery/${cat.category}`)}
                className="
                  group cursor-pointer
                  relative overflow-hidden
                  rounded-xl
                  aspect-[4/3]
                "
              >
                <img
                  src={cat.url}
                  alt={cat.category}
                  loading="lazy"
                  className="
                    w-full h-full
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t from-black/80 via-black/40 to-transparent
                    flex flex-col items-center justify-center
                  "
                >
                  <h3 className="text-white text-2xl font-serif capitalize">
                    {cat.category}
                  </h3>

                  <p className="text-gray-300 text-sm mt-1">
                    {cat.count} photos
                  </p>
                </div>

                {/* BORDER EFFECT */}
                <div
                  className="
                    absolute inset-0
                    border-2 border-amber-400/0
                    group-hover:border-amber-400/40
                    rounded-xl
                    transition-all duration-300
                  "
                />
              </div>
            ))}
          </div>

          {/* 🔥 PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-amber-400/20 text-white rounded disabled:opacity-30"
              >
                Prev
              </button>

              <span className="text-gray-300">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-amber-400/20 text-white rounded disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
