export default function Hero() {
  return (
    <section
      className="
        h-[85vh]
        flex items-center justify-center
        bg-[url('/insta3.jpg')]
        bg-cover
        bg-center
        bg-no-repeat
        relative
      "
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative text-center text-white px-6">
        <h2 className="text-3xl md:text-4xl tracking-[0.25em] font-light">
          WILDLIFE PHOTOGRAPHY
        </h2>
        <p className="mt-6 text-sm tracking-[0.3em] text-gray-300 uppercase">
          Through the lens of nature
        </p>
      </div>
    </section>
  );
}
