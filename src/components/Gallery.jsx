import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "https://xd9awgtwlj.execute-api.eu-north-1.amazonaws.com";

export default function Gallery() {
  const [grouped, setGrouped] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const byCategory = data.reduce((acc, img) => {
          if (!acc[img.category]) acc[img.category] = [];
          acc[img.category].push(img);
          return acc;
        }, {});
        setGrouped(byCategory);
      });
  }, []);

  return (
    <>
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-center text-4xl font-serif mb-16">Gallery</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {Object.entries(grouped).map(([category, images]) => {
              const cover = images[0]; // 👈 one image only

              return (
                <div
                  key={category}
                  onClick={() => navigate(`/gallery/${category}`)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <img
                      src={cover.url}
                      alt={category}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <h2 className="absolute inset-0 flex items-center justify-center text-3xl font-serif text-white capitalize tracking-widest">
                      {category}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
