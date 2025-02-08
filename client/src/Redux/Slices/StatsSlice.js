import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState= {
    allUsersCount: 0,
    subscribersCount: 0
};

export const getStatsData= createAsyncThunk("/stats/get", async () => {
    try {
        const res= axiosInstance.get("/admin/stats/users");
        toast.promise(res, {
            loading: "Getting the stats...",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to load data stats"
        })

        return (await res).data;
    } catch(err) { 
        toast.error(err?.response?.data?.message);
    }
})

const statsSlice= createSlice({
    name: "stats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getStatsData.fulfilled, (state, action) => {
            state.allUsersCount= action?.payload?.allUsersCount;
            state.subscribersCount= action?.payload?.subscribedUsersCount;
        })
    }
})

export default statsSlice.reducer;