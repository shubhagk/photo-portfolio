import { useEffect, useState } from "react";
import DeleteImage from "./DeleteImage";

const API_URL = "https://d2keqyvqexxfrb.cloudfront.net";

export default function ImageList({ category }) {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/images.json`);
      const data = await res.json();

      const filtered = category
        ? data.filter(
            (img) => img.category?.toLowerCase() === category.toLowerCase(),
          )
        : data;

      setImages(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [category]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img, index) => (
        <div key={index} className="relative">
          <img src={img.url} className="h-40 w-full object-cover rounded" />

          {/* ✅ DELETE BUTTON HERE */}
          <DeleteImage url={img.url} refresh={fetchImages} />
        </div>
      ))}
    </div>
  );
}
