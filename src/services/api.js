const API_URL =
  "https://gamma-school-web-backend-production.up.railway.app/api";

export async function apiRequest(endpoint, options = {}) {
  const isFormData =
    options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // JSON request হলে Content-Type লাগবে
  // FormData হলে browser নিজে multipart boundary set করবে
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (typeof window !== "undefined") {
    const token =
      window.localStorage.getItem("admin_token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}