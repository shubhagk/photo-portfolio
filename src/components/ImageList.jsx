import { useEffect, useState } from "react";
import DeleteImage from "./DeleteImage";

export default function ImageList({ category }) {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    let url = "https://photo-portfolio-admin.onrender.com/images";

    if (category) {
      url += `?category=${category}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, [category]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img) => (
        <div key={img._id} className="relative">
          <img src={img.url} className="h-40 w-full object-cover rounded" />

          <DeleteImage id={img._id} refresh={fetchImages} />
        </div>
      ))}
    </div>
  );
}
