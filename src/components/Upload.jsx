import { useState, useEffect } from "react";

const API_URL = "https://d2keqyvqexxfrb.cloudfront.net";

// ⚠️ Replace with your S3 upload endpoint (we'll keep it simple for now)
const UPLOAD_API = "https://YOUR_UPLOAD_LAMBDA_URL";

export default function Upload() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  /* -------------------------------
     GET CATEGORIES FROM JSON
  --------------------------------*/
  useEffect(() => {
    fetch(`${API_URL}/images.json`)
      .then((res) => res.json())
      .then((data) => {
        const unique = [
          ...new Set(
            data
              .map((img) => img.category)
              .filter((c) => c && c.toLowerCase() !== "shuffle"),
          ),
        ];
        setCategories(unique);
      })
      .catch(console.error);
  }, []);

  /* -------------------------------
     FILE SELECT
  --------------------------------*/
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

  /* -------------------------------
     UPLOAD (S3 via Lambda)
  --------------------------------*/
  const handleSubmit = async () => {
    const category = (newCategory || selectedCategory || "").trim();

    if (!images.length) return alert("Select images");
    if (!category) return alert("Select category");

    try {
      for (const img of images) {
        const formData = new FormData();
        formData.append("file", img.file);
        formData.append("category", category);

        await fetch(UPLOAD_API, {
          method: "POST",
          body: formData,
        });
        window.location.reload();
      }

      alert("Upload successful");

      setImages([]);
      setSelectedCategory("");
      setNewCategory("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* CATEGORY SELECT */}
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

      {/* NEW CATEGORY */}
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

      {/* FILE INPUT */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* PREVIEW */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, i) => (
          <img key={i} src={img.preview} className="h-32 object-cover" />
        ))}
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="bg-amber-500 px-6 py-3 rounded text-black"
      >
        Upload
      </button>
    </div>
  );
}
