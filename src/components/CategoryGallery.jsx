import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://www.taruitsolutions.com/gallery.php?page=1&limit=1000";

const IMAGE_ROOT = "https://www.taruitsolutions.com";

export default function CategoryGallery() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (active !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    fetch(`${API_URL}&ts=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.images || []).filter(
          (img) => img.category === category && img.thumb && img.full,
        );
        setImages(filtered);
        console.log("Category images:", filtered);
      });
  }, [category]);

  return (
    <>
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between mb-10">
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

          {images.length === 0 && (
            <p className="text-gray-400 text-center">No images found.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, i) => (
              <img
                key={img.thumb}
                src={`${IMAGE_ROOT}/images/thumbs/${category.toLowerCase()}/${img.thumb}`}
                loading="lazy"
                className="cursor-pointer rounded-lg h-[220px] object-cover"
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {active !== null && images[active] && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onClick={() => setActive(null)}
        >
          {/* Full image */}
          <img
            src={`${IMAGE_ROOT}/images/full/${category.toLowerCase()}/${images[active].full}`}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close */}
          <button
            onClick={() => setActive(null)}
            className="absolute top-6 right-6 text-white text-3xl select-none"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-6 text-white text-5xl select-none hover:opacity-80"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i + 1) % images.length);
            }}
            className="absolute right-6 text-white text-5xl select-none hover:opacity-80"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
