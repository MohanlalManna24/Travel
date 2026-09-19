import { create } from "zustand";

const BACKEND_URL = "http://localhost:4000";

export const useAdminAuthStore = create((set, get) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // 1. Check if an active admin session exists
  checkAdminAuth: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${BACKEND_URL}/api/admin/auth/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send httpOnly cookies
      });

      const data = await response.json();

      if (response.ok && data.authenticated && data.admin) {
        set({
          admin: data.admin,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, admin: data.admin };
      } else {
        set({
          admin: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return { success: false };
      }
    } catch (err) {
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Network error checking admin session",
      });
      return { success: false };
    }
  },

  // 2. Admin Login
  loginAdmin: async ({ username, password }) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${BACKEND_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.message || "Invalid admin credentials";
        set({
          isLoading: false,
          error: errorMsg,
          isAuthenticated: false,
          admin: null,
        });
        return { success: false, message: errorMsg };
      }

      set({
        admin: data.admin,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, message: data.message, admin: data.admin };
    } catch (err) {
      const errorMsg = "Server connection failed. Please ensure the backend is running.";
      set({
        isLoading: false,
        error: errorMsg,
        isAuthenticated: false,
      });
      return { success: false, message: errorMsg };
    }
  },

  // 3. Admin Logout
  logoutAdmin: async () => {
    try {
      await fetch(`${BACKEND_URL}/api/admin/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Admin logout error:", err);
    } finally {
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Clear Error state
  clearError: () => set({ error: null }),
}));
