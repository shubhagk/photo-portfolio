import { useState, useEffect } from "react";
import { getCategories, uploadPhoto } from "../../services/imageService.js";

export default function UploadManager({ setView, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [species, setSpecies] = useState("");
  const [subspecies, setSubspecies] = useState("");
  const [place, setPlace] = useState("");
  const [desc, setDesc] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  // 🔥 Load categories from API
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.map((item) => item.value)))
      .catch(console.error);
  }, []);

  // 🔥 Handle file OR folder selection
  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    // Detect folder upload
    if (selected[0].webkitRelativePath) {
      const folderName = selected[0].webkitRelativePath.split("/")[0];
      setCategory(folderName);
      setIsNewCategory(false);
    }

    setFiles(selected);
  };

  // 🔥 Upload logic (unchanged, just cleaned)
  const handleUpload = async () => {
    if (!files.length) return alert("Select files");
    if (!category) return alert("Category is required");

    setLoading(true);

    try {
      for (const file of files) {
        await uploadPhoto(file, {
          category,
          country,
          species,
          subspecies,
          place,
          year: Number(year) || "",
          description: desc,
        });
      }

      // 🔥 Trigger refresh + navigate
      onUploadSuccess();
      setView("list");

      // Reset state
      setFiles([]);
      setCategory("");
      setCountry("");
      setSpecies("");
      setSubspecies("");
      setPlace("");
      setDesc("");
      setYear(new Date().getFullYear());
      setIsNewCategory(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setView("home")}
        className="bg-gray-700 px-4 py-2 rounded"
      >
        Back
      </button>

      {/* CATEGORY */}
      <div className="space-y-2">
        <select
          value={isNewCategory ? "new" : category}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "new") {
              setIsNewCategory(true);
              setCategory("");
            } else {
              setIsNewCategory(false);
              setCategory(val);
            }
          }}
          className="p-3 bg-black border border-gray-600 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
          <option value="new">+ Add New Category</option>
        </select>

        {isNewCategory && (
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter new category"
            className="p-3 bg-black border border-gray-600 w-full"
          />
        )}
      </div>

      {/* METADATA */}
      <div className="grid grid-cols-2 gap-4">
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className="p-3 bg-black border"
        />

        <input
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Species"
          className="p-3 bg-black border"
        />

        <input
          value={subspecies}
          onChange={(e) => setSubspecies(e.target.value)}
          placeholder="Subspecies"
          className="p-3 bg-black border"
        />

        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Place"
          className="p-3 bg-black border"
        />

        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="p-3 bg-black border"
        />

        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (optional)"
          className="p-3 bg-black border"
        />
      </div>

      {/* FILE / FOLDER UPLOAD */}
      <div className="space-y-4">
        <div className="flex gap-4">
          {/* FILES */}
          <label className="bg-blue-500 px-4 py-2 cursor-pointer rounded text-black">
            Select Files
            <input
              type="file"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          {/* FOLDER */}
          <label className="bg-purple-500 px-4 py-2 cursor-pointer rounded text-black">
            Select Folder
            <input
              type="file"
              multiple
              webkitdirectory=""
              onChange={handleFiles}
              className="hidden"
            />
          </label>
        </div>

        <p className="text-sm text-gray-400">{files.length} file(s) selected</p>
      </div>

      {/* FILE PREVIEW */}
      <div className="grid grid-cols-4 gap-2">
        {files.map((f, i) => (
          <div key={i} className="text-xs truncate border p-2">
            {f.name}
          </div>
        ))}
      </div>

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-green-500 px-6 py-3 text-black rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
