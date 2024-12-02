import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 404) {
      //   console.error("Unauthorized access");
      // logout();
      //   throw error;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
