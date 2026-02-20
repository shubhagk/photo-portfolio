export default function InstagramRow() {
  const instaImages = [
    "/insta1.jpg",
    "/insta2.jpg",
    "/insta3.jpg",
    "/insta4.jpg",
    "/insta5.jpg",
  ];

  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="font-serif text-lg tracking-widest mb-10 text-white">
          INSTAGRAM
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {instaImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-full object-cover hover:opacity-80 transition"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
