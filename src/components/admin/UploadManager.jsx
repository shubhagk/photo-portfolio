import { useState, useEffect } from "react";
import { API_BASE } from "../../config/config";

export default function UploadManager({ setView, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [species, setSpecies] = useState("");
  const [desc, setDesc] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  // 🔥 Load categories from API
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then(setCategories)
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
    if (!category || !country) return alert("Category & Country required");

    setLoading(true);

    try {
      for (const file of files) {
        // 1️⃣ Get presigned URL
        const res = await fetch(`${API_BASE}/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            category,
          }),
        });

        const { uploadUrl, s3Key, fileUrl } = await res.json();

        // 2️⃣ Upload to S3
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        // 3️⃣ Save metadata
        await fetch(`${API_BASE}/metadata`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            s3Key,
            imageUrl: fileUrl,
            category,
            country,
            species,
            year: Number(year),
            desc,
          }),
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
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="p-3 bg-black border"
        />

        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
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
