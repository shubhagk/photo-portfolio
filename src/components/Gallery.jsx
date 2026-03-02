import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://www.taruitsolutions.com/gallery.php?page=1&limit=200";

const IMAGE_ROOT = "https://www.taruitsolutions.com";

export default function Gallery() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}&ts=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};

        (data.images || []).forEach((img) => {
          if (!img.category || !img.thumb) return;

          if (!grouped[img.category]) {
            grouped[img.category] = img.thumb;
          }
        });

        setCategories(grouped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-center text-4xl font-serif mb-16 text-white">
            Gallery
          </h1>

          {loading && (
            <p className="text-center text-gray-400">Loading gallery…</p>
          )}

          {!loading && Object.keys(categories).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {Object.entries(categories).map(([category, thumb]) => (
                <div
                  key={category}
                  onClick={() => navigate(`/gallery/${category}`)}
                  className="cursor-pointer group"
                >
                  <div className="relative h-[320px] overflow-hidden rounded-xl bg-black">
                    <img
                      src={`${IMAGE_ROOT}/images/thumbs/${category.toLowerCase()}/${thumb}`}
                      alt={category}
                      width={800}
                      height={600}
                      fetchpriority="high"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <h2 className="absolute inset-0 flex items-center justify-center text-3xl font-serif text-white tracking-widest capitalize">
                      {category}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && Object.keys(categories).length === 0 && (
            <p className="text-center text-gray-500">No images found.</p>
          )}
        </div>
      </div>
    </>
  );
}
