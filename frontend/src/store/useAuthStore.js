 import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

 export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth : true,
    onlineUsers:[],
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
            get().connectSocket();
        } catch (error) {
            console.log("Error in authentication",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup : async (data) => {
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({ authUser: res.data})

            toast.success("Account created successfully!")

            get().connectSocket();

        } catch (error) {
            let errorMessage = "An unexpected error occurred. Please try again.";

            // ✅ FINAL ATTEMPT: Explicitly check for an Axios response with data and the 'message' key
            if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                errorMessage = error.response.data.message;
            } else if (error.message && error.message.includes("Network Error")) {
                // This catches true network failures
                errorMessage = "A network error occurred. Check your connection or server status.";
            }

            toast.error(errorMessage);
            //toast.error(error.response.data.message)
        } finally{
            set({isSigningUp:false})
        }
    },

    login : async (data) => {
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({ authUser: res.data})

            toast.success("Logged in successfully")

            get().connectSocket()

        } catch (error) {
            let errorMessage = "An unexpected error occurred. Please try again.";

            // ✅ FINAL ATTEMPT: Explicitly check for an Axios response with data and the 'message' key
            if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                errorMessage = error.response.data.message;
            } else if (error.message && error.message.includes("Network Error")) {
                // This catches true network failures
                errorMessage = "A network error occurred. Check your connection or server status.";
            }

            toast.error(errorMessage);
            //toast.error(error.response.data.message)
        } finally{
            set({isLoggingIn:false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");   
            get().disconnectSocket();     
        } catch (error) {
            toast.error("Error logging out");
            console.log("Logout error:", error);
        } 
    },

    updateProfile: async(data) =>{
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile",data)
            set({authUser:res.data})
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:",error);
            toast.error(error.response.data.message);
        }
    },

    connectSocket: () =>{
        const {authUser} =get()
        if(!authUser || get().socket?.connected) return

        const socket = io(BASE_URL,{
            withCredentials:true //this emsures cookies are sent with the connection
        })

        socket.connect();

        set({socket})

        //listen for online users events
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket : () => {
       if (get().socket?.connected) get().socket.disconnect()
    },
 }));