import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,

  token: localStorage.getItem("token") || null,

  isAuthenticated: !!localStorage.getItem("token"),

  setAuth: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));

    localStorage.setItem("token", token);

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  updateUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));

    set({ user });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    sessionStorage.clear();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
