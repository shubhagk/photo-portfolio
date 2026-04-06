import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import Navbar from "../components/Navbar.jsx";
import DeleteImage from "../components/DeleteImage.jsx";

const API_URL = "https://d2keqyvqexxfrb.cloudfront.net";

export default function CategoryGallery() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const LOAD_COUNT = 12;
  const [visibleCount, setVisibleCount] = useState(LOAD_COUNT);

  /* -------------------------------
     INFINITE SCROLL
  --------------------------------*/
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

  /* RESET */
  useEffect(() => {
    setVisibleCount(LOAD_COUNT);
  }, [search, category]);

  /* FETCH */
  useEffect(() => {
    fetch(`${API_URL}/images.json`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (img) => img.category?.toLowerCase() === category.toLowerCase(),
        );
        setImages(filtered);
      })
      .catch(console.error);
  }, [category]);

  /* SEARCH */
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = images
      .filter((img) => img.url.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 6);

    setSuggestions(matches);
  }, [search, images]);

  /* FILTER + PAGINATION */
  const filteredImages = images.filter((img) =>
    img.url.toLowerCase().includes(search.toLowerCase()),
  );

  const visibleImages = filteredImages.slice(0, visibleCount);

  /* DELETE FIX */
  const handleDeleteFromUI = (deletedUrl) => {
    setImages((prev) => prev.filter((img) => img.url !== deletedUrl));

    setVisibleCount((prev) => Math.max(LOAD_COUNT, prev - 1));
  };

  /* LIGHTBOX */
  const close = () => setActiveIndex(null);

  const showPrev = () =>
    setActiveIndex(
      (i) => (i - 1 + filteredImages.length) % filteredImages.length,
    );

  const showNext = () => setActiveIndex((i) => (i + 1) % filteredImages.length);

  return (
    <>
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate("/gallery")}
            className="mb-8 text-amber-400"
          >
            ← Back
          </button>

          <h1 className="text-3xl mb-10 capitalize">{category}</h1>

          {/* SEARCH */}
          <div className="flex justify-center mb-12">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="px-5 py-3 rounded bg-[#1a140d] text-white"
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-3 gap-6">
            {visibleImages.map((img) => {
              const realIndex = filteredImages.findIndex(
                (i) => i.url === img.url,
              );

              return (
                <div key={realIndex} className="relative">
                  <img
                    src={img.thumbnail || img.url}
                    onClick={() => setActiveIndex(realIndex)}
                    className="cursor-pointer"
                  />

                  <DeleteImage url={img.url} onDelete={handleDeleteFromUI} />
                </div>
              );
            })}
          </div>

          {visibleCount < filteredImages.length && (
            <p className="text-center mt-10 text-gray-400">Loading more...</p>
          )}
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null &&
        createPortal(
          <>
            <div onClick={close} className="fixed inset-0 bg-black/90" />
            <img
              src={filteredImages[activeIndex].url}
              className="fixed inset-0 m-auto max-w-[90vw] max-h-[90vh]"
            />
          </>,
          document.body,
        )}
    </>
  );
}
