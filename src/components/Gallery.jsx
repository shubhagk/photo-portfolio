import Navbar from "../components/Navbar.jsx";

// Sample image data
const images = [
  { id: 1, src: "/insta1.jpg", alt: "Image 1" },
  { id: 2, src: "/insta2.jpg", alt: "Image 2" },
  { id: 3, src: "/insta3.jpg", alt: "Image 3" },
  { id: 4, src: "/insta4.jpg", alt: "Image 4" },
  { id: 5, src: "/insta5.jpg", alt: "Image 5" },
];

export default function Gallery() {
  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 z-50 w-full h-20 bg-[#160d04]">
        <Navbar />
      </div>

      {/* Page background */}
      <div className="min-h-screen bg-[#0e0b07] pt-24">
        {/* Gallery container */}
        <div
          className="
            max-w-[1200px]
            mx-auto
            grid
            [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]
            gap-6
            p-[100px]
            bg-[#160d04]
            rounded-xl
            max-sm:[grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]
            max-sm:gap-4
            max-sm:p-6
          "
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="
                bg-black
                p-1
                rounded-xl
                border
                border-black
                overflow-hidden
                shadow-lg
                transition-transform
                duration-300
                ease-in-out
                hover:scale-105
              "
            >
              &nbsp; &nbsp;
              <img
                src={image.src}
                alt={image.alt}
                className="
                  w-full
                  h-[200px]
                  object-cover
                  rounded-lg
                  block
                  max-sm:h-[150px]
                "
              />
              &nbsp; &nbsp;
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
