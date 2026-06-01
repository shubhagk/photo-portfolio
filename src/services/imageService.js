import { API_URL, API_BASE } from "../config/config";

export async function searchImages(query) {
  if (!query?.trim()) {
    return [];
  }

  const res = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query.trim())}`,
  );

  return res.json();
}

export async function deleteImage(imageId, s3Key) {
  const res = await fetch(`${API_BASE}/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageId,
      s3Key,
    }),
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return true;
}
