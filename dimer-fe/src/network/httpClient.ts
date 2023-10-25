import axios from "axios";

const client = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// TODO: Add Auth Interceptor & Global Error Handler?

export { client };