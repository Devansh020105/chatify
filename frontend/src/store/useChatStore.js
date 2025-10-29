import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
//import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUSer: null,
    isUserLoading: false,
    isMessagesLoading:false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled"))===true,

    toggleSound: ()=>{
        
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({isSoundEnabled: !get().isSoundEnabled});
    },

    setActiveTab: (tab) => set({activeTab:tab}),
    setSelectedUser: (userObject) => set({ selectedUSer: userObject }),

    getAllContacts: async () => {
          set({isUserLoading: true});
        try{
            const res = await axiosInstance.get(`/messages/contacts`);
            set({ allContacts: res.data });
        } catch(error){
            toast.error(error.response?.data?.message);
        } finally {
            set({isUserLoading:false});
        }
    },
    getMyChatPartner: async () => {
          set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally{
            set({isUserLoading: false});
        }
    },

    getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
    },

    sendMessage: async (messageData) => {
        const {selectedUSer,messages} = get();
        const {authUser} = useAuthStore.getState()
        
        const tempId = `temp-${Date.now()}`
        
        const optimisticMessage = {
            _id : tempId,
            senderId: authUser._id,
            receiverId :selectedUSer._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };
        //immideatly update UI
        set({messages: [...messages,optimisticMessage]})
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUSer._id}`,messageData)
            //set({messages:messages.concate(res.data)})
            if (res.data) {
             set((state) => ({
                messages: state.messages.map(msg =>
                msg._id === tempId
                ? { ...res.data, isOptimistic: false } 
                        : msg),
                 //messages: state.messages.concat(res.data), 
             }));
        }
        } catch (error) {
            //toast.error.response.data.messages || "Something went wrong"
            set((state) => ({
             messages: state.messages.filter(msg => msg._id !== tempId),
            }));
            const errorMessage = error.response?.data?.message || "Failed to send message. Check network and server logs.";
            toast.error(errorMessage);
            console.error("Axios Send Error:", error);
        }
    }
})) ;