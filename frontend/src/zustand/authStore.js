import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Axios client with credentials for HTTP-only cookies
export const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

export const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem("travel_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: (() => {
    try {
      return localStorage.getItem("travel_logged_in") === "true";
    } catch {
      return false;
    }
  })(),
  isLoading: false,
  error: null,

  // 1. Check & Sync Active User Session
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await authClient.get("/api/users/me");
      if (res.data?.user) {
        const user = res.data.user;
        localStorage.setItem("travel_user", JSON.stringify(user));
        localStorage.setItem("travel_logged_in", "true");
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, user };
      } else {
        throw new Error("Invalid user profile");
      }
    } catch (err) {
      // If unauthorized, clear client session
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("travel_user");
        localStorage.removeItem("travel_logged_in");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      } else {
        set({ isLoading: false });
      }
      return { success: false };
    }
  },

  // 2. User Sign In
  login: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authClient.post("/api/users/login", {
        email: email.trim(),
        password,
      });

      if (res.data?.user) {
        const user = res.data.user;
        localStorage.setItem("travel_user", JSON.stringify(user));
        localStorage.setItem("travel_logged_in", "true");
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, message: res.data.message || "Welcome back!", user };
      } else {
        throw new Error("No user profile returned");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password.";
      set({
        isLoading: false,
        error: msg,
      });
      return { success: false, message: msg };
    }
  },

  // 3. User Registration
  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authClient.post("/api/users/register", userData);

      if (res.data?.user) {
        const user = res.data.user;
        localStorage.setItem("travel_user", JSON.stringify(user));
        localStorage.setItem("travel_logged_in", "true");
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, message: res.data.message || "Registration successful!", user };
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create account.";
      set({
        isLoading: false,
        error: msg,
      });
      return { success: false, message: msg };
    }
  },

  // 4. User Logout
  logout: async () => {
    try {
      await authClient.post("/api/users/logout");
    } catch (e) {
      console.warn("Logout request notice:", e.message);
    } finally {
      localStorage.removeItem("travel_user");
      localStorage.removeItem("travel_logged_in");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // 5. Update Profile (Base + Full Details)
  updateProfile: async (payload) => {
    const currentUser = get().user;
    if (!currentUser?.id) return { success: false, message: "No active user session" };

    try {
      set({ isLoading: true });
      // Update Base User
      const userRes = await authClient.put(`/api/users/updateuser/${currentUser.id}`, {
        fullname: payload.fullname || payload.name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password || undefined,
        avatar: payload.avatar || payload.profile_img,
        location: payload.location,
        city: payload.city,
        state: payload.state,
      });

      // Update Full Details
      let detailsRes = null;
      try {
        detailsRes = await authClient.put(`/api/user-details/update/${currentUser.id}`, {
          userId: currentUser.id,
          profileImg: payload.avatar || payload.profile_img,
          DOB: payload.DOB || "2000-01-01",
          gender: payload.gender || "Other",
          address_line1: payload.address_line1 || payload.address || "Not specified",
          address_line2: payload.address_line2 || null,
          city: payload.city || "Not specified",
          state: payload.state || "Not specified",
          pin_code: payload.pin_code || "000000",
          country: payload.country || "India",
          nationality: payload.nationality || "Indian",
          passport_number: payload.passport_number || "N/A",
          preferred_airport: payload.preferred_airport || null,
          preferred_seat: payload.preferred_seat || null,
          dietary_preferences: payload.dietary_preferences || null,
          medical_notes: payload.medical_notes || null,
          Emergency_contact_name: payload.Emergency_contact_name || null,
          Emergency_contact_number: payload.Emergency_contact_number || null,
          Emergency_contact_relationship: payload.Emergency_contact_relationship || null,
        });
      } catch (detErr) {
        console.warn("Update full details error:", detErr.message);
      }

      const updatedUser = {
        ...currentUser,
        ...(userRes.data?.user || {}),
        ...payload,
      };

      localStorage.setItem("travel_user", JSON.stringify(updatedUser));
      set({
        user: updatedUser,
        isLoading: false,
      });

      return { success: true, message: "Profile updated successfully!", user: updatedUser };
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to update profile";
      return { success: false, message: msg };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;