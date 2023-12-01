import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
});

// TODO: Add Auth Interceptor & Global Error Handler?

export { client };
