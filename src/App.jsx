// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Gallery from "./components/Gallery";

// Pages
import Home from "./pages/Home";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays here so it shows on every page */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  );
}
