import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance.js"
import toast from "react-hot-toast";

// `localStorage.getItem("")` is a method used to retrieve data from the browser's local storage. 
// The `localStorage` object allows you to store key-value pairs in a web browser with no expiration time. The data persists even after the browser is closed and reopened.
const initialState= {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: (localStorage.getItem("data") && localStorage.getItem("data") !== "undefined" && JSON.parse(localStorage.getItem("data"))) || {}
};

export const createAccount= createAsyncThunk("/auth/signup", async (data) => {
    try{
        const res= axiosInstance.post("/user/register", data);
        toast.promise(res, {
            loading: "Wait! creating your account...",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to create account" // bad response is also considered as an error in promise
        });
        
        return (await res).data;
    } catch(err){ // executed when received bad response
        toast.error(err?.response?.data?.message);
    }
})

export const login= createAsyncThunk("/auth/login", async (data) => {
    try{
        const res= axiosInstance.post("/user/login", data);
        toast.promise(res, {
            loading: "Wait! authentication in progress...",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to login"
        })

        return (await res).data;
    } catch(err){
        toast.error(err?.response?.data?.message);
    }
})

export const logout= createAsyncThunk("/auth/logout", async () => {
    try{
        const res= axiosInstance.get("/user/logout");
        toast.promise(res, {
            loading: "Wait! logout in progress...",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to logout"
        });

        return (await res).data;
    } catch(err){
        toast.error(err?.response?.data?.message);
    }
})

export const updateProfile= createAsyncThunk("/user/update/profile", async (data) => {
    try{
        const res= axiosInstance.put("/user/update", data);

        toast.promise(res, {
            loading: "Wait! profile update in progress...",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to update profile"
        });

        return (await res).data;
    } catch(err){
        toast.error(err?.response?.data?.message);
    }
})

export const getUserData= createAsyncThunk("/user/details", async () => {
    try{
        const res= axiosInstance.get("/user/me");
        return (await res).data;
    } catch(err){
        toast.error(err?.response?.data?.message);
    }
})

export const getResetPasswordUrl= createAsyncThunk("/user/forgot-password", async (data) => {
    try {
        const res= axiosInstance.post("/user/reset", data);
        toast.promise(res, {
            loading: "Validating your email...",
            success: (response) => {
                return response?.data?.message;
            }
        })

        return (await res).data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

export const resetPassword= createAsyncThunk("/user/reset-password", async (data) => {
    try {
        const res= axiosInstance.post(`/user/reset/${data.token}`, data.data);
        toast.promise(res, {
            loading: "Wait! password reset in progress...",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to change the password"
        })

        return (await res).data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

export const changePassword= createAsyncThunk("/user/change-password", async (data) => {
    try {
        const res= axiosInstance.post("/user/change-password", data);
        toast.promise(res, {
            loading: "Wait! validating your old password",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to change the password"
        })

        return (await res).data; 
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

const authSlice= createSlice({
    name: "auth",
    initialState,
    reducers: {}, // The `reducers` property is an object where you define the reducer functions for handling actions.
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            // console.log(action); // this `action` is same as of `response` in Login.jsx 
            localStorage.setItem("data", JSON.stringify(action?.payload?.user)); // store objects in locaStorage after stringfy, use after parsing
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);

            state.isLoggedIn= true;
            state.data= action?.payload?.user;
            state.role= action?.payload?.user?.role;
        })
        .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.data= {};
            state.isLoggedIn= false;
            state.role= "";
        })
        .addCase(getUserData.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);

            state.isLoggedIn= true;
            state.data= action?.payload?.user;
            state.role= action?.payload?.user?.role;
        })
    } 
})

export const {}= authSlice.actions;
export default authSlice.reducer;