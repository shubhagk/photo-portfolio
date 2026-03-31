import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function Admin() {
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // 🔥 Fetch categories
  useEffect(() => {
    //fetch("http://localhost:5000/categories")
    fetch("https://photo-portfolio-admin.onrender.com/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(previews);
  };

  // 🔥 Cleanup previews
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = newCategory || selectedCategory;

    if (!images.length) {
      alert("Please select images");
      return;
    }

    if (!finalCategory) {
      alert("Please select or create a category");
      return;
    }

    const formData = new FormData();
    formData.append("imageName", imageName);
    formData.append("category", finalCategory);

    images.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      //const res = await fetch("http://localhost:5000/upload",{}
      const res = await fetch(
        "https://photo-portfolio-admin.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      console.log(data);

      alert("Upload successful!");

      setImages([]);
      setImageName("");
      setNewCategory("");
      setSelectedCategory("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0806] to-[#1a1410] text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Category Select */}
          <div>
            <label className="text-gray-400 text-sm">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setNewCategory("");
              }}
              className="w-full p-3 bg-black border border-gray-700 rounded"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* New Category */}
          <div>
            <label className="text-gray-400 text-sm">
              Or Create New Category
            </label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setSelectedCategory("");
              }}
              placeholder="e.g. wildlife"
              className="w-full p-3 bg-black border border-gray-700 rounded"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 tracking-wide">
              Upload Images
            </label>

            {/* Hidden input */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              id="fileInput"
              className="hidden"
            />

            {/* Custom button */}
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              className="
      bg-amber-600 hover:bg-amber-500
      text-black px-6 py-3 rounded-lg
      text-sm tracking-wide
      transition
    "
            >
              Choose Images
            </button>

            {/* File names */}
            <div className="mt-3 text-sm">
              {images.length > 0 ? (
                <ul className="text-green-400 space-y-1">
                  {images.map((img, index) => (
                    <li key={index}>{img.file.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-400">No file chosen</p>
              )}
            </div>
          </div>

          {/* Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.preview}
                  className="h-32 w-full object-cover rounded"
                />
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-amber-500 px-6 py-3 rounded text-black"
          >
            Upload
          </button>
        </div>
      </section>
    </div>
  );
}
