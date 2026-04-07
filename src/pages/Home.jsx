import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

const API_URL = "https://d2keqyvqexxfrb.cloudfront.net";

const Home = () => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const fallback = `${API_URL}/wildlife/wildlife1.jpeg`;

  // ✅ Fetch images
  useEffect(() => {
    fetch(`${API_URL}/images.json`)
      .then((res) => res.json())
      .then((data) => {
        const imagesArray = Array.isArray(data) ? data : data.images || [];

        const grouped = {};

        imagesArray.forEach((img) => {
          const category = img.category?.toLowerCase() || "uncategorized";
          if (category === "shuffle") return;

          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(img);
        });

        const oneRandomPerCategory = Object.keys(grouped).map((category) => {
          const imgs = grouped[category];
          return imgs[Math.floor(Math.random() * imgs.length)];
        });

        setImages(oneRandomPerCategory);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ Auto slide
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const safeIndex = images.length > 0 ? index % images.length : 0;
  const current = images[safeIndex] || { url: fallback };

  return (
    <div className="w-full min-h-screen bg-[#0a0806] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        {/* ✅ SINGLE IMAGE (NO STACKING BUGS) */}
        <img
          src={current.url}
          alt="wildlife"
          className="absolute inset-0 w-full h-full object-cover scale-110 animate-zoom cursor-pointer z-10"
          onClick={() => {
            if (current.category) {
              navigate(`/gallery/${encodeURIComponent(current.category)}`);
            }
          }}
        />

        {/* ✅ Overlay (non-blocking) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0a0806] z-20 pointer-events-none" />

        {/* TEXT */}
        <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <h1 className="text-4xl md:text-7xl lg:text-8xl tracking-[0.2em] font-light uppercase mb-6">
            Vet in Wild
          </h1>

          <p className="text-lg md:text-2xl tracking-[0.35em] text-gray-300 mb-12 font-light">
            Wildlife Photography
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-gradient-to-b from-[#0a0806] to-[#1a1410] py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm tracking-[0.5em] text-amber-400 mb-4 uppercase">
            About
          </h2>

          <h3 className="text-3xl md:text-5xl font-serif mb-8">
            Capturing Nature's Untamed Beauty
          </h3>

          <p className="text-gray-300 mb-6">
            From the vast savannas to dense rainforests, I capture wildlife in
            their natural habitat.
          </p>

          <p className="text-gray-400">
            Every photo tells a story of survival and beauty.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-[#1a1410] py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-sm tracking-[0.5em] text-amber-400 mb-12 uppercase">
            Specializations
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {["wildlife", "birds", "nature"].map((cat, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/gallery/${cat}`)}
                className="cursor-pointer border p-8 rounded-lg hover:border-amber-400"
              >
                <h3 className="text-xl capitalize">{cat}</h3>
                <p className="text-gray-400 text-sm">
                  Explore {cat} photography
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
