// Small fetch wrapper: adds the HTTP Basic header and turns API errors into ApiError objects.

const KEY = "asset-tracker-auth";

export function getAuth() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(auth) {
  sessionStorage.setItem(KEY, JSON.stringify(auth));
}

export function clearAuth() {
  sessionStorage.removeItem(KEY);
}

// Basic auth token = base64("username:password")
export function makeToken(username, password) {
  return btoa(unescape(encodeURIComponent(`${username}:${password}`)));
}

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors; // field errors from validation (400), if any
  }
}

export async function api(path, { method = "GET", body, token } = {}) {
  const auth = token ? { token } : getAuth();
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && auth.token) headers["Authorization"] = `Basic ${auth.token}`;

  let res;
  try {
    res = await fetch(path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Cannot reach the API. Is the backend running on port 8080?");
  }

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, (data && data.message) || `Request failed (${res.status})`, data && data.errors);
  }
  return data;
}
