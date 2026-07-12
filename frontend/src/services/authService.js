import { api, getApiErrorMessage } from "./api";

/**
 * Auth Service
 *
 * Purpose:
 * Handles login, logout, and session-state helpers for the admin panel.
 *
 * Notes:
 * The real backend expects { email, password } 
 * The real backend's role values are "super_admin" and "principal"
 * (with underscores) 
 */
export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data.data;

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user_id", user.id);
      localStorage.setItem("admin_user_name", user.name);
      localStorage.setItem("admin_user_email", user.email);
      localStorage.setItem("admin_role", user.role);

      return { success: true, token, user };
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user_id");
    localStorage.removeItem("admin_user_name");
    localStorage.removeItem("admin_user_email");
    localStorage.removeItem("admin_role");
  },

  isAuthenticated() {
    return !!localStorage.getItem("admin_token");
  },

  getCurrentUser() {
    return {
      id: localStorage.getItem("admin_user_id"),
      name: localStorage.getItem("admin_user_name"),
      email: localStorage.getItem("admin_user_email"),
      role: localStorage.getItem("admin_role")
    };
  }
};