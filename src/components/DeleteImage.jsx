export default function DeleteImage({ id, refresh }) {
  const handleDelete = async () => {
    if (!window.confirm("Delete this image?")) return;

    await fetch(`https://photo-portfolio-admin.onrender.com/delete/${id}`, {
      method: "DELETE",
    });

    refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="absolute top-2 right-2 bg-red-600 px-2 py-1 text-xs rounded"
    >
      Delete
    </button>
  );
}
