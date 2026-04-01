import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Upload from "../components/Upload.jsx";
import CategoryList from "../components/CategoryList.jsx";

export default function Admin() {
  const [showList, setShowList] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0806] to-[#1a1410] text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Toggle Button */}
          <button
            onClick={() => setShowList(!showList)}
            className="bg-amber-600 px-6 py-3 rounded text-black"
          >
            {showList ? "Back to Upload" : "List Images"}
          </button>

          {/* Conditional Render */}
          {showList ? <CategoryList /> : <Upload />}
        </div>
      </section>
    </div>
  );
}
