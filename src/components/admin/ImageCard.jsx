import { useState } from "react";
import EditMetadataModal from "./EditMetadataModal";

export default function ImageCard({ img, onDelete }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="border p-2 bg-black relative">
      <div className="relative">
        <img
          src={img.imageUrl}
          className="h-40 w-full object-cover pointer-events-none"
        />
      </div>

      <div className="text-sm mt-2">
        <p>{img.species}</p>
        <p>{img.country}</p>
      </div>

      <div className="flex gap-2 mt-2 relative z-10">
        <button
          onClick={() => setShowEdit(true)}
          className="bg-blue-500 px-2 py-1"
        >
          Edit
        </button>

        <button
          onClick={() => {
            if (!window.confirm("Delete this image?")) return;
            onDelete(img);
          }}
          className="bg-red-500 px-2 py-1 text-xs"
        >
          Delete
        </button>
      </div>

      {showEdit && (
        <EditMetadataModal
          img={img}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => {
            Object.assign(img, updated); // quick UI update
          }}
        />
      )}
    </div>
  );
}
