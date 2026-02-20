import Navbar from "../components/Navbar.jsx";

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-[#0e0b07] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="h-[80vh] bg-[#20170d] bg-fixed bg-center bg-cover">
        <div className="h-full flex flex-col items-center justify-center text-center px-6 bg-[#0e0b07]/90">
          <h1
            className="
              text-3xl md:text-[3.5rem]
              tracking-[0.75em] md:tracking-[0.75em]
              font-light uppercase mb-3
              bg-[#20170d]
              bg-[url('/insta2.jpg')]
              bg-cover bg-center
              px-6 py-4
            "
          >
            Wildlife Photography
          </h1>

          <p className="text-sm md:text-lg tracking-[0.3em] opacity-80">
            Explore the wild through our lens
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-[#20170d] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="tracking-[0.4em] font-normal mb-6">OUR MISSION</h2>
          <p className="text-[#ccc] text-lg leading-relaxed">
            Capturing the raw beauty of nature from the plains of Africa to the
            peaks of the Andes.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
