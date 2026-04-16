export default function AdminHome({ setView }) {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <div className="flex justify-center gap-6">
        <button
          onClick={() => setView("list")}
          className="bg-amber-500 px-6 py-3 rounded text-black"
        >
          Delete Images
        </button>

        <button
          onClick={() => setView("upload")}
          className="bg-green-500 px-6 py-3 rounded text-black"
        >
          Upload Images
        </button>
      </div>
    </div>
  );
}
