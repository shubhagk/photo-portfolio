import { useState } from "react";

import Navbar from "../components/Navbar.jsx";
import AdminHome from "../components/admin/AdminHome.jsx";
import ImageList from "../components/admin/ImageList.jsx";
import UploadManager from "../components/admin/UploadManager.jsx";
import AdminLogin from "../components/admin/AdminLogin.jsx";
import { ADMIN_TOKEN_KEY } from "../config/config.js";

export default function Admin() {
  const [view, setView] = useState("home");

  const [refreshKey, setRefreshKey] = useState(0);

  const loggedIn = Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));

  const triggerRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  // NOT logged in
  if (!loggedIn) {
    return (
      <AdminLogin
        onLogin={() => {
          window.location.reload();
        }}
      />
    );
  }

  // Logged in
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex justify-end max-w-6xl mx-auto px-6 pt-24">
        <button
          onClick={() => {
            sessionStorage.removeItem(ADMIN_TOKEN_KEY);

            window.location.reload();
          }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>
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
