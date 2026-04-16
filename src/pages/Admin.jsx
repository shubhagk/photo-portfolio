import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import AdminHome from "../components/admin/AdminHome.jsx";
import ImageList from "../components/admin/ImageList.jsx";
import UploadManager from "../components/admin/UploadManager.jsx";

export default function Admin() {
  const [view, setView] = useState("home");
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔥 Trigger re-fetch in ImageList
  const triggerRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-24 max-w-6xl mx-auto px-6">
        {view === "home" && <AdminHome setView={setView} />}

        {view === "list" && (
          <ImageList setView={setView} refreshKey={refreshKey} />
        )}

        {view === "upload" && (
          <UploadManager setView={setView} onUploadSuccess={triggerRefresh} />
        )}
      </div>
    </div>
  );
}
