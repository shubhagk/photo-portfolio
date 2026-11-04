import { ADMIN_TOKEN_KEY, API_BASE } from "../config/config.js";

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getImages(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const suffix = params.size ? `?${params}` : "";
  return request(`/photos${suffix}`);
}

export async function getCategories() {
  return request("/categories");
}

export async function searchImages(queryOrFilters = "") {
  const params =
    typeof queryOrFilters === "string"
      ? new URLSearchParams({ q: queryOrFilters.trim() })
      : new URLSearchParams(
          Object.entries(queryOrFilters).filter(([, value]) => value),
        );
  return request(`/search?${params}`);
}

export async function loginAdmin(username, password) {
  return request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function uploadPhoto(file, metadata) {
  const body = new FormData();
  body.set("file", file);
  Object.entries(metadata).forEach(([key, value]) => body.set(key, String(value ?? "")));
  return request("/admin/photos", { method: "POST", body });
}

export async function updatePhoto(photoId, updates) {
  return request(`/admin/photos/${encodeURIComponent(photoId)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteImage(photoId) {
  return request(`/admin/photos/${encodeURIComponent(photoId)}`, {
    method: "DELETE",
  });
}
