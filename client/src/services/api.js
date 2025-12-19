import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Quan trọng cho CSRF
});

// Lưu CSRF token trong memory
let csrfToken = null;

// Lấy CSRF token từ server
const fetchCsrfToken = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/csrf-token", {
      withCredentials: true,
    });
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
};

// Khởi tạo CSRF token khi app load
fetchCsrfToken();

// Thêm CSRF token vào header của mỗi request
api.interceptors.request.use(async (config) => {
  // Lấy token mới nếu chưa có
  if (!csrfToken) {
    await fetchCsrfToken();
  }

  // Thêm token vào headers cho tất cả request
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
    config.headers["x-xsrf-token"] = csrfToken;
  }

  return config;
});

// Export để có thể refresh token khi cần
export const refreshCsrfToken = fetchCsrfToken;

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const reviewService = {
  getReviews: async () => {
    const response = await api.get("/reviews");
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export const profileService = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/profile", profileData);
    return response.data;
  },
};

export const movieService = {
  getMovies: async () => {
    const response = await api.get("/movies");
    return response.data;
  },
  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },
  getSimilarMovies: async (id) => {
    const response = await api.get(`/movies/${id}/similar`);
    return response.data;
  },
};
export default api;
