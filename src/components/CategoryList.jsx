import { useEffect, useState } from "react";
import ImageList from "./ImageList";
import { getCategories } from "../services/imageService.js";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.map((category) => category.value)))
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
