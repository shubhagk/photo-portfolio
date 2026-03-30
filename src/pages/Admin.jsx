import { useState } from "react";
import Navbar from "../components/Navbar.jsx";

export default function Admin() {
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!images.length) {
      alert("Please select at least one image");
      return;
    }

    // Example: prepare form data for backend
    const formData = new FormData();
    formData.append("imageName", imageName);

    images.forEach((img) => {
      formData.append("images", img.file);
    });

    console.log("Ready to upload:", formData);

    // TODO: send formData to backend using fetch / axios
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0806] to-[#1a1410]">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-sm tracking-[0.5em] font-light text-amber-400 mb-4 uppercase">
              Admin Panel
            </h1>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Upload New Image(s)
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Select one or more images to upload to the gallery.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {/* Image Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 tracking-wide">
                Image Name
              </label>
              <input
                type="text"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="Safari at Dusk"
                className="
                  w-full bg-black/40 border border-white/10
                  px-5 py-4 rounded-lg
                  text-white placeholder-gray-600
                  focus:outline-none focus:border-amber-400/50
                  transition-colors
                "
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 tracking-wide">
                Select Image Folder
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-gray-300"
              />

              <p className="text-xs text-gray-500 mt-2">
                Select a folder containing images (all images inside will be
                uploaded)
              </p>
            </div>

            {/* Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img.preview}
                    alt="Preview"
                    className="rounded-lg border border-white/10 object-cover h-40 w-full"
                  />
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full md:w-auto
                bg-gradient-to-r from-amber-600 to-amber-500
                hover:from-amber-500 hover:to-amber-400
                text-black font-medium
                px-12 py-4 rounded-lg
                tracking-wider uppercase text-sm
                transition-all duration-300
                hover:shadow-lg hover:shadow-amber-500/20
              "
            >
              Upload
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
