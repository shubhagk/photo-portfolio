// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Gallery from "./components/Gallery";
import Admin from "./pages/Admin";
// Pages
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import GlobalSearch from "./components/GlobalSearch";
import CategoryGallery from "./components/CategoryGallery.jsx";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays here so it shows on every page */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<GlobalSearch />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:category" element={<CategoryGallery />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
