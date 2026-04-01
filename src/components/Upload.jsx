import { useState, useEffect } from "react";

export default function Upload() {
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetch("https://photo-portfolio-admin.onrender.com/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(previews);
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleSubmit = async () => {
    const finalCategory = newCategory || selectedCategory;

    if (!images.length) return alert("Select images");
    if (!finalCategory) return alert("Select category");

    const formData = new FormData();
    formData.append("imageName", imageName);
    formData.append("category", finalCategory);

    images.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      await fetch("https://photo-portfolio-admin.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      alert("Upload successful");

      setImages([]);
      setImageName("");
      setSelectedCategory("");
      setNewCategory("");
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setNewCategory("");
        }}
        className="w-full p-3 bg-black border border-gray-700 rounded"
      >
        <option value="">Select Category</option>
        {categories.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="New category"
        value={newCategory}
        onChange={(e) => {
          setNewCategory(e.target.value);
          setSelectedCategory("");
        }}
        className="w-full p-3 bg-black border border-gray-700 rounded"
      />

      {/* Upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Preview */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, i) => (
          <img key={i} src={img.preview} className="h-32 object-cover" />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-amber-500 px-6 py-3 rounded text-black"
      >
        Upload
      </button>
    </div>
  );
}
