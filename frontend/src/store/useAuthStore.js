 import {create} from "zustand";

 export const useAuthStore = create((set) => ({
    authUser: {name: "Devansh", _id: 123, age: 21},
    isloogedIn: false
 }))