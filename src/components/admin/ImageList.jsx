import { useState } from "react";
import { searchImages, deleteImage } from "../../services/imageService";
import useCategories from "../../services/useCategories";
import ImageCard from "./ImageCard";

export default function ImageList({ setView }) {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = useCategories();

  /* ---------------- SEARCH ---------------- */
  const handleSearch = async () => {
    try {
      if (!search.trim() && !category) {
        setImages([]);
        return;
      }

      const results = await searchImages({ q: search.trim(), category });

      setImages(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- CATEGORY CHANGE ---------------- */
  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;

    setCategory(selectedCategory);
    setSearch("");

    if (!selectedCategory) {
      setImages([]);
      return;
    }

    try {
      const results = await searchImages({ category: selectedCategory });
      setImages(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (img) => {
    try {
      await deleteImage(img.imageId);

      setImages((prev) => prev.filter((i) => i.imageId !== img.imageId));
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  /* ---------------- GROUP BY CATEGORY ---------------- */
  const grouped = images.reduce((acc, img) => {
    const category = img.category || "uncategorized";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(img);

    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Back */}
      <button
        onClick={() => setView("home")}
        className="bg-gray-700 px-4 py-2 rounded"
      >
        Back
      </button>

      {/* Search / Category */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-4 py-2 rounded bg-[#1a140d] text-white border border-amber-400/30 min-w-[220px]"
        >
          <option value="">Select Category</option>

          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.value} ({c.count})
            </option>
          ))}
        </select>

        <span className="text-gray-400">OR</span>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCategory("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search images..."
          className="w-96 px-4 py-2 rounded bg-white text-black border"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Results */}
      {images.length === 0 && (
        <p className="text-gray-400">
          Search or select a category to view images.
        </p>
      )}

      {Object.keys(grouped).map((category) => (
        <div key={category}>
          <h2 className="text-xl mb-4 capitalize">
            {category} ({grouped[category].length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {grouped[category].map((img) => (
              <ImageCard key={img.imageId} img={img} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
