import { create } from "zustand";
import { api } from "../services/api";
import type { FormDataType } from "../pages/SignUpPage";
import toast from "react-hot-toast";
import type { LoginFormData } from "../pages/LoginPage";

export interface user {
  _id: string;
  userName: string;
  email: string;
  profilePic: null;
}

interface useAuthStoreType {
  user: user | null;
  isChecking: boolean;
  isLoading: boolean;
  isAuthenticated: () => Promise<void>;
  signUp: (formData: FormDataType) => Promise<void>;
  logIn: (formData: LoginFormData) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfile: ({ profilePic }: { profilePic: string }) => Promise<void>;
}

export const useAuthStore = create<useAuthStoreType>((set) => ({
  user: null,
  isChecking: true,
  isLoading: false,
  isAuthenticated: async () => {
    try {
      const { data } = await api.get("/auth/check");
      set({ user: data.user });
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

  logIn: async (formData) => {
    try {
      set({ isLoading: true });
      const { data } = await api.post("/auth/login", formData);
      set({ user: data.user });
      toast.success("LoggedIn Sucessfully");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response.data.message || error.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  logOut: async () => {
    try {
      set({ isLoading: true });
      await api.post("/auth/logout", {});
      set({ user: null });
      toast.success("Logged out Successfully");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response.data.message || error.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profilePic) => {
    try {
      set({ isLoading: true });
      const { data } = await api.put("/auth/update-profile", profilePic);
      set({ user: data.profile });
      toast.success("Profile updated Successfully");
    } catch (error: any) {
      console.log("Error in update profile", error);
      const errorMessage =
        error.response.data.message || error.message || "Something went wrong";
      toast.error(errorMessage);
    }finally{
       set({ isLoading: false })
    }
  },
}));
