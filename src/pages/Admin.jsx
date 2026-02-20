import { useState } from "react";

export default function Admin() {
  const [image, setImage] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl mb-6">Admin Upload</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-6"
      />

      {image && <img src={image} className="max-w-md border" />}
    </div>
  );
}
