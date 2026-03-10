import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#0a0806] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen bg-[url('/wildlife/wildlife4.jpg')] bg-scroll bg-center bg-cover">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0806]" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1
            className="
              text-4xl md:text-7xl lg:text-8xl
              tracking-[0.2em] md:tracking-[0.25em]
              font-light uppercase mb-6
              animate-fade-in
            "
          >
            VetInWild
          </h1>

          <p className="text-lg md:text-2xl tracking-[0.35em] text-gray-300 mb-12 font-light">
            Wildlife Photography
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
          <svg
            className="w-6 h-6 text-white/60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-b from-[#0a0806] to-[#1a1410] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm tracking-[0.5em] font-light text-amber-400 mb-4 uppercase">
              About
            </h2>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
            <h3 className="text-3xl md:text-5xl font-serif font-light mb-8 leading-tight">
              Capturing Nature&apos;s Untamed Beauty
            </h3>
          </div>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-center font-light mb-8">
            From the vast savannas of Africa to the dense rainforests of South
            America, I document the raw, unfiltered essence of wildlife in their
            natural habitats.
          </p>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed text-center font-light">
            Every photograph tells a story of survival, beauty, and the delicate
            balance of our planet&apos;s ecosystems. My work aims to inspire
            conservation and deepen our connection with the natural world.
          </p>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-[#1a1410] py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm tracking-[0.5em] font-light text-amber-400 mb-12 uppercase text-center">
            Specializations
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* African Wildlife */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/gallery/wildlife")}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate("/gallery/wildlife");
              }}
              className="group cursor-pointer pointer-events-auto"
            >
              <div className="bg-gradient-to-br from-amber-900/20 to-transparent border border-amber-900/30 p-8 rounded-lg hover:border-amber-700/50 transition-all duration-300">
                <h3 className="text-xl font-serif mb-3 group-hover:text-amber-400 transition-colors">
                  African Wildlife
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Big cats, elephants, and the great migration
                </p>
              </div>
            </div>

            {/* Avian Portraits */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/gallery/birds")}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate("/gallery/birds");
              }}
              className="group cursor-pointer pointer-events-auto"
            >
              <div className="bg-gradient-to-br from-amber-900/20 to-transparent border border-amber-900/30 p-8 rounded-lg hover:border-amber-700/50 transition-all duration-300">
                <h3 className="text-xl font-serif mb-3 group-hover:text-amber-400 transition-colors">
                  Avian Portraits
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Rare birds captured in stunning detail
                </p>
              </div>
            </div>

            {/* Wild Landscapes */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/gallery/nature")}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate("/gallery/nature");
              }}
              className="group cursor-pointer pointer-events-auto"
            >
              <div className="bg-gradient-to-br from-amber-900/20 to-transparent border border-amber-900/30 p-8 rounded-lg hover:border-amber-700/50 transition-all duration-300">
                <h3 className="text-xl font-serif mb-3 group-hover:text-amber-400 transition-colors">
                  Wild Landscapes
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Breathtaking vistas and natural wonders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
