import { create } from "zustand";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

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
  image?: string | null;
  createdAt: string;
  isOptimistic: boolean;
}

export interface AllContactsType {
  _id: string;
  profilePic: string;
  userName: string;
}

export interface sendMesssagePayLoadType {
  text: string;
  image?: string | null;
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
  loadingMessages: boolean;
  isSoundEnabled: boolean;
  toggleButton: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (selectedUser: chatType | null) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: sendMesssagePayLoadType) => Promise<void>;
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
  loadingMessages: false,
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
      set({ loadingMessages: true });
      const { data } = await api.get(`/${userId}`);
      set({ messages: data });
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.message || "Something went wrong";
      toast.error(errorMessage);
      set({ messages: [] });
    } finally {
      set({ loadingMessages: false });
    }
  },

   sendMessage: async (messageData) => {
  const { selectedUser } = get();
  const { user } = useAuthStore.getState();

  if (!user?._id || !selectedUser?._id) return;

  const tempId = `temp-${Date.now()}`;

  // Create optimistic message
  const optimisticMessage = {
    _id: tempId,
    senderId: user._id,
    receiverId: selectedUser._id,
    text: messageData.text,
    image: messageData.image,
    createdAt: new Date().toISOString(),
    isOptimistic: true,
  };

  // Instantly show it in UI
  set((state) => ({
    messages: [...state.messages, optimisticMessage],
  }));

  try {
    const res = await api.post(`/send/${selectedUser._id}`, messageData);

    // Replace optimistic message with real one
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === tempId ? res.data : msg
      ),
    }));
  } catch (error: any) {
    // Remove optimistic message on failure
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== tempId),
    }));

    toast.error(error.response?.data?.message || "Something went wrong");
  }
},

}));
