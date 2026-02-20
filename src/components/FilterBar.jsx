const categories = ["All", "Wildlife", "Birds", "Landscape"];

export default function FilterBar({ active, setActive }) {
  return (
    <div className="flex justify-center gap-8 text-sm uppercase tracking-wider">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`pb-2 border-b-2 ${
            active === cat
              ? "border-white"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
