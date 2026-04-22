const defaultBackendUrl = "http://127.0.0.1:8000";

export const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL?.trim() || defaultBackendUrl;
