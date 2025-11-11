import { create } from "zustand";
import { api } from "../services/api";
import toast from "react-hot-toast";

export interface chatType {
  _id: string;
  profilePic: string;
  userName: string;
}

export interface MessageType {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
}

export interface AllContactsType {
  _id: string;
  profilePic: string;
  userName: string;
}

export interface useChatStoreType {
  allContacts: AllContactsType[] | null;
  chats: chatType[] | null;
  messages: MessageType[];
  activeTab: "chats" | "contacts";
  selectedUser: chatType | null;
  loading: boolean;
  loadingChatsPartners: boolean;
  loadingContacts: boolean;
  isSoundEnabled: boolean;
  toggleButton: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (selectedUser: chatType | null) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
}

export const useChatStore = create<useChatStoreType>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  loading: false,
  loadingContacts: false,
  loadingChatsPartners: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  toggleButton: () => {
    localStorage.setItem("isSoundEnabled", String(!get().isSoundEnabled));
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  getAllContacts: async () => {
    try {
      set({ loadingContacts: true });
      const { data } = await api.get("/contacts");
      set({ allContacts: data.contacts });
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.message || "Something went wrong";
      toast.error(errorMessage);
      set({ allContacts: [] });
    } finally {
      set({ loadingContacts: false });
    }
  },

  getMyChatPartners: async () => {
    try {
      set({ loadingChatsPartners: true });
      const { data } = await api.get("/chats", {});
      set({ chats: data.chatPartners });
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.message || "Something went wrong";
      toast.error(errorMessage);
      set({ chats: [] });
    } finally {
      set({ loadingChatsPartners: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    try {
      set({ loading: true });
      const { data } = await api.get(`/${userId}`);
      set({ messages: data });
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.message || "Something went wrong";
      toast.error(errorMessage);
      set({ messages: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
