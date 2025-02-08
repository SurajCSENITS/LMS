import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance.js";
import toast from "react-hot-toast";

const initialState= {
    key: "",
    subscription_id: "",
    order_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
};

export const getRazorpayId= createAsyncThunk("/razorpay/getId", async () => {
    try {
        const res= await axiosInstance.get("/payments/razorpay-key");
        return res.data;
    } catch(err) {
        toast.error("Failed to load data");
    }
})

export const purchaseCourseBundle= createAsyncThunk("/purchaseCourse", async () => {
    try {
        const res= await axiosInstance.post("/payments/subscribe");
        return res.data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

export const verifyUserPayment= createAsyncThunk("/payments/verify", async (data) => {
    try {
        const res= await axiosInstance.post("/payments/verify", {
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_subscription_id: data.razorpay_subscription_id,
            razorpay_signature: data.razorpay_signature
        });
        return res.data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

export const getPaymentRecord= createAsyncThunk("/payments/record", async () => {
    try {
        const res= axiosInstance.get("/payments?count=100");
        toast.promise(res, {
            loading: "Getting payment records",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to get payment records"
        })

        return (await res).data;
    } catch(err) {
        toast.error("Operation failed");
    }
})

export const cancelCourseBundle= createAsyncThunk("/payments/cancel", async () => {
    try {
        const res= axiosInstance.post("/payments/unsubscribe");
        toast.promise(res, {
            loading: "Unsubscribing the bundle",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to unsubscribe"
        })

        return (await res).data
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

const razorpaySlice= createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getRazorpayId.fulfilled, (state, action) => {
            state.key= action?.payload?.key;     
        })
        .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
            state.subscription_id= action?.payload?.subscription_id;
            state.order_id= action?.payload?.order_id;
        })
        .addCase(verifyUserPayment.fulfilled, (state, action) => {
            toast.success(action?.payload?.message);
            state.isPaymentVerified= action?.payload?.success;
        })
        .addCase(verifyUserPayment.rejected, (state, action) => {
            toast.error(action?.payload?.message);
            state.isPaymentVerified= action?.payload?.success;
        })
        .addCase(getPaymentRecord.fulfilled, (state, action) => {
            state.allPayments= action?.payload?.allPayments;
            state.finalMonths= action?.payload?.finalMonths;
            state.monthlySalesRecord= action?.payload?.monthlySalesRecord;
        })
    }
})

export default razorpaySlice.reducer;