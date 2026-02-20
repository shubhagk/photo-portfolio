import { useEffect } from "react";

export default function Lightbox({ image, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <img src={image} className="max-w-[90%] max-h-[90%]" />
      <button className="absolute top-6 right-6 text-3xl">×</button>
    </div>
  );
}
