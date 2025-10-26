 import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

 export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth : true,
    isSigningUp: false,
    isLoggingIn: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
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
        } catch (error) {
            toast.error("Error logging out");
            console.log("Logout error:", error);
        } 
    },
 }));