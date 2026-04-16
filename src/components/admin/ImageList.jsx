import { useEffect, useState } from "react";
import { API_BASE } from "../../config/config";
import ImageCard from "./ImageCard";

export default function ImageList({ setView, refreshKey }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/images`)
      .then((res) => res.json())
      .then(setImages);
  }, [refreshKey]);

  // 🔥 DELETE HANDLER (instant UI update)
  const handleDelete = async (img) => {
    try {
      await fetch(`${API_BASE}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: img.imageId,
          s3Key: img.s3Key,
        }),
      });

      setImages((prev) => prev.filter((i) => i.imageId !== img.imageId));
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };
  // Group by category
  const grouped = images.reduce((acc, img) => {
    if (!acc[img.category]) acc[img.category] = [];
    acc[img.category].push(img);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <button
        onClick={() => setView("home")}
        className="bg-gray-700 px-4 py-2 rounded"
      >
        Back
      </button>

      {Object.keys(grouped).map((category) => (
        <div key={category}>
          <h2 className="text-xl mb-4 capitalize">{category}</h2>

          <div className="grid grid-cols-4 gap-4">
            {grouped[category].map((img) => (
              <ImageCard
                key={img.imageId}
                img={img}
                onDelete={handleDelete} // 🔥 pass handler
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
