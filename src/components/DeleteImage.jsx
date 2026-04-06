const DELETE_API =
  "https://52frn34zrwzdqn4s27m7nsicke0jymwv.lambda-url.eu-north-1.on.aws/";

export default function DeleteImage({ url, refresh }) {
  const handleDelete = async () => {
    if (!window.confirm("Delete this image?")) return;

    try {
      const key = url.split(".net/")[1];

      console.log("Deleting key:", key); // 👈 ADD THIS

      await fetch(`${DELETE_API}?key=${encodeURIComponent(key)}`);

      // wait a bit for Lambda + S3 sync
      setTimeout(() => {
        refresh();
      }, 500);

      refresh();
    } catch (err) {
      console.error("Delete failed:", err);
    }
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
