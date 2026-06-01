import { useEffect, useState } from "react";
import { IMAGES_CLOUDFRONT_API_URL } from "../config/config";

export default function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${IMAGES_CLOUDFRONT_API_URL}/images.json`)
      .then((res) => res.json())
      .then((data) => {
        const categoryMap = {};

        const filteredData = data.filter(
          (img) => img.category?.toLowerCase() !== "shuffle",
        );

        filteredData.forEach((img) => {
          if (img.category) {
            categoryMap[img.category] = (categoryMap[img.category] || 0) + 1;
          }
        });

        setCategories(
          Object.entries(categoryMap).map(([value, count]) => ({
            value,
            count,
          })),
        );
      })
      .catch(console.error);
  }, []);

  return categories;
}
