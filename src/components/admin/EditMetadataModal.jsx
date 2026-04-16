import { useState } from "react";
import { API_BASE } from "../../config/config";

export default function EditMetadataModal({ img, onClose, onSaved }) {
  const [form, setForm] = useState({
    category: img.category || "",
    country: img.country || "",
    species: img.species || "",
    desc: img.desc || "",
    year: img.year || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await fetch(`${API_BASE}/metadata`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageId: img.imageId,
        updates: form,
      }),
    });

    onSaved(form);
    onClose();
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
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
          className="w-full p-2 bg-black border"
        />
        <input
          name="desc"
          value={form.desc}
          onChange={handleChange}
          placeholder="Description"
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
