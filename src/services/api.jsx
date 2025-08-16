const API_BASE = "https://gdrive-backend-elin.onrender.com/api";

// Generic helper
const request = async (endpoint, method = "GET", body) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // 🔑 keep session cookies
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Request failed");
  }
  return res.json();
};

// Specific API functions
export const login = (email, password) =>
  request("/auth/login", "POST", { email, password });

export const signup = (name, email, password) =>
  request("/auth/signup", "POST", { name, email, password });

export const logout = () => request("/auth/logout", "POST");

export const getUserData = () => request("/user/data");

export default {
  login,
  signup,
  logout,
  getUserData,
};
