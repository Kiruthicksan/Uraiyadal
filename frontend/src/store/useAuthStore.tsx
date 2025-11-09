import { create } from "zustand";
import { api } from "../services/api";
import type { FormDataType } from "../pages/SignUpPage";
import { data } from "react-router-dom";
import toast from "react-hot-toast";

interface user {
  _id: string;
  userName: string;
  email: string;
}

interface useAuthStoreType {
  user: user | null;
  isChecking: boolean;
  isLoading: boolean;
  isAuthenticated: () => Promise<void>;
  signUp: (formData: FormDataType) => Promise<void>;
}

export const useAuthStore = create<useAuthStoreType>((set) => ({
  user: null,
  isChecking: true,
  isLoading: false,
  isAuthenticated: async () => {
    try {
      const { data } = await api.get("/auth/check");
      set({ user: data });
    } catch (error) {
      console.error("Error", error);
      set({ user: null });
    } finally {
      set({ isChecking: false });
    }
  },

  signUp: async (formData) => {
    try {
      set({ isLoading: true });
      const { data } = await api.post("/auth/signup", formData);
      set({ user: data.user });
      toast.success("Account created Sucessfully");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response.data.message || error.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));
