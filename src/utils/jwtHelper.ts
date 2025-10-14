// src/utils/jwtHelper.js

export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded; // return object (sub, userid, role, name, exp, etc)
  } catch {
    return null;
  }
}
