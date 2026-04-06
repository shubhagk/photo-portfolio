import { useEffect, useState } from "react";
import ImageList from "./ImageList";

const API_URL = "https://d2keqyvqexxfrb.cloudfront.net";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/images.json`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ Extract unique categories
        const uniqueCategories = [
          ...new Set(
            data
              .map((img) => img.category)
              .filter((cat) => cat && cat.toLowerCase() !== "shuffle"),
          ),
        ];

        setCategories(uniqueCategories);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {!selectedCategory ? (
        <>
          <h2 className="text-xl">Select Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className="bg-black border border-gray-700 p-4 rounded hover:bg-amber-600 hover:text-black transition capitalize"
              >
                {cat}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedCategory("")}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            ← Back to Categories
          </button>

          <h2 className="text-xl capitalize">{selectedCategory}</h2>

          <ImageList category={selectedCategory} />
        </>
      )}
    </div>
  );
}
