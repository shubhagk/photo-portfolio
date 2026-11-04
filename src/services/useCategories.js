import { useEffect, useState } from "react";
import { getCategories } from "./imageService.js";

export default function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  return categories;
}
