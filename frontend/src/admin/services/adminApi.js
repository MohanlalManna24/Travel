import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

/**
 * Pre-configured Axios instance for Admin operations.
 * Enforces withCredentials: true on every request for HTTP-only JWT admin authentication.
 */
export const adminClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for standardized error handling
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected server error occurred.";
    if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      message = error.response.data.errors.map((e) => e.msg || e.message).join(", ");
    } else if (error.message) {
      message = error.message;
    }
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.original = error;
    return Promise.reject(customError);
  }
);

/**
 * Reusable Admin API Services
 */
export const adminApi = {
  // ---------------------------------------------------------------------------
  // AUTHENTICATION
  // ---------------------------------------------------------------------------
  auth: {
    login: async (credentials) => {
      const res = await adminClient.post("/api/admin/auth/login", credentials);
      return res.data;
    },
    verify: async () => {
      const res = await adminClient.get("/api/admin/auth/verify");
      return res.data;
    },
    logout: async () => {
      const res = await adminClient.post("/api/admin/auth/logout");
      return res.data;
    },
  },

  // ---------------------------------------------------------------------------
  // BOOKINGS & RESERVATIONS
  // ---------------------------------------------------------------------------
  bookings: {
    getAll: async () => {
      const res = await adminClient.get("/api/bookings");
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
    getById: async (id) => {
      const res = await adminClient.get(`/api/bookings/${id}`);
      return res.data;
    },
    update: async (id, data) => {
      const res = await adminClient.put(`/api/bookings/${id}`, data);
      return res.data?.booking || res.data?.data || res.data;
    },
    delete: async (id) => {
      const res = await adminClient.delete(`/api/bookings/${id}`);
      return res.data;
    },
  },

  // ---------------------------------------------------------------------------
  // DESTINATIONS / EXPEDITIONS
  // ---------------------------------------------------------------------------
  destinations: {
    getAll: async () => {
      const res = await adminClient.get("/api/destinations");
      return Array.isArray(res.data) ? res.data : res.data?.data || res.data?.destinations || [];
    },
    getById: async (id) => {
      const res = await adminClient.get(`/api/destinations/${id}`);
      return res.data;
    },
    create: async (data) => {
      const res = await adminClient.post("/api/destinations", data);
      return res.data?.destination || res.data?.data || res.data;
    },
    update: async (id, data) => {
      const res = await adminClient.put(`/api/destinations/${id}`, data);
      return res.data?.destination || res.data?.data || res.data;
    },
    delete: async (id) => {
      const res = await adminClient.delete(`/api/destinations/${id}`);
      return res.data;
    },
  },

  // ---------------------------------------------------------------------------
  // USER PROFILES & ACCOUNTS
  // ---------------------------------------------------------------------------
  users: {
    getAll: async () => {
      try {
        const res = await adminClient.get("/api/user-details");
        return Array.isArray(res.data)
          ? res.data
          : res.data?.userFullDetails || res.data?.users || res.data?.data || [];
      } catch (err) {
        const res = await adminClient.get("/api/users");
        return Array.isArray(res.data)
          ? res.data
          : res.data?.users || res.data?.userFullDetails || res.data?.data || [];
      }
    },
    getById: async (id) => {
      const res = await adminClient.get(`/api/users/${id}`);
      return res.data;
    },
    create: async (data) => {
      const res = await adminClient.post("/api/users/createuser", data);
      return res.data?.user || res.data;
    },
    update: async (id, data) => {
      const res = await adminClient.put(`/api/users/${id}`, data);
      return res.data?.user || res.data;
    },
    delete: async (id) => {
      const res = await adminClient.delete(`/api/users/${id}`);
      return res.data;
    },
  },

  // ---------------------------------------------------------------------------
  // NOTIFICATIONS & INQUIRIES
  // ---------------------------------------------------------------------------
  notifications: {
    getAll: async () => {
      const res = await adminClient.get("/api/notifications");
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
    getById: async (id) => {
      const res = await adminClient.get(`/api/notifications/${id}`);
      return res.data;
    },
    create: async (data) => {
      const res = await adminClient.post("/api/notifications", data);
      return res.data?.notification || res.data?.data || res.data;
    },
    update: async (id, data) => {
      const res = await adminClient.put(`/api/notifications/${id}`, data);
      return res.data?.notification || res.data?.data || res.data;
    },
    toggleRead: async (id, isRead) => {
      const res = await adminClient.patch(`/api/notifications/${id}/read`, { isRead });
      return res.data?.notification || res.data?.data || res.data;
    },
    markAllRead: async () => {
      const res = await adminClient.patch("/api/notifications/mark-all-read");
      return res.data;
    },
    reply: async (id, replyData) => {
      const res = await adminClient.post(`/api/notifications/${id}/reply`, replyData);
      return res.data?.notification || res.data?.data || res.data;
    },
    delete: async (id) => {
      const res = await adminClient.delete(`/api/notifications/${id}`);
      return res.data;
    },
    bulkActions: async (action, ids) => {
      const res = await adminClient.post("/api/notifications/bulk-actions", { action, ids });
      return res.data;
    },
  },
};

export default adminApi;
