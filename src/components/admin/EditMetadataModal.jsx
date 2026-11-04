import { useState } from "react";
import { updatePhoto } from "../../services/imageService.js";

//Details of meta data
export default function EditMetadataModal({ img, onClose, onSaved }) {
  const [form, setForm] = useState({
    category: img.category || "",
    country: img.country || "",
    species: img.species || "",
    subspecies: img.subspecies || "",
    place: img.place || "",
    description: img.description || img.desc || "",
    year: img.year || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updated = await updatePhoto(img.imageId, form);
      onSaved(updated);
      onClose();
    } catch (error) {
      alert(error.message || "Could not save photo metadata");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-[#111] text-white p-6 rounded w-96 space-y-4">
        <h2 className="text-xl font-bold">Edit Metadata</h2>

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 bg-black border"
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full p-2 bg-black border"
        />
        <input
          name="species"
          value={form.species}
          onChange={handleChange}
          placeholder="Species"
          className="w-full p-2 bg-black border"
        />
        <input
          name="subspecies"
          value={form.subspecies}
          onChange={handleChange}
          placeholder="Subspecies"
          className="w-full p-2 bg-black border"
        />
        <input
          name="place"
          value={form.place}
          onChange={handleChange}
          placeholder="Place"
          className="w-full p-2 bg-black border"
        />
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
          className="w-full p-2 bg-black border"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="w-full p-2 bg-black border"
        />

        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-600 px-4 py-2">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-green-500 px-4 py-2 text-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
